// Serves a built folder with real Apache (mod_rewrite, mod_headers, mod_deflate, mod_expires, mod_brotli) and PHP, so the
// shipped .htaccess and contact-submit.php are exercised exactly as on Hostinger.
//   [HTTPD_DIR=<...>/Apache24] [PHP_DIR=<...>/php] node scripts/serve-apache.mjs <docroot> [--port 4330]
// PHP_DIR defaults to ../php beside HTTPD_DIR. Port: --port, env PW_PORT, else 4330. Config and logs go to the OS temp folder.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const fwd = (p) => resolve(p).replaceAll(String.fromCharCode(92), '/');
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const port = Number((portIndex >= 0 && args[portIndex + 1]) || process.env.PW_PORT || 4330);
const docArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--port');
const docroot = fwd(docArg ?? process.env.PW_DOCROOT ?? 'dist');

// Windows: the portable Apache and PHP unpacked in .tools/ (git-ignored). Linux (CI): Debian/Ubuntu apache2 and libapache2-mod-php.
const linux = process.platform !== 'win32';
const httpdDir = process.env.HTTPD_DIR ?? (linux ? '/usr/lib/apache2' : resolve('.tools/Apache24'));
const httpdBin = linux ? '/usr/sbin/apache2' : join(httpdDir, 'bin', 'httpd.exe');
if (!existsSync(httpdBin)) {
  console.error(linux ? 'Install apache2 (and libapache2-mod-php for PHP).' : 'Set HTTPD_DIR to the Apache24 folder (the one holding bin/httpd.exe).');
  process.exit(1);
}
if (!existsSync(join(docroot, 'index.html'))) {
  console.error(`No built site at ${docroot} (index.html missing). Run the build first.`);
  process.exit(1);
}
const phpDir = process.env.PHP_DIR ?? join(httpdDir, '..', 'php');
const linuxPhp = linux && existsSync(join(httpdDir, 'modules')) ? readdirSync(join(httpdDir, 'modules')).find((f) => /^libphp.*\.so$/.test(f)) : undefined;
const hasPhp = linux ? Boolean(linuxPhp) : existsSync(join(phpDir, 'php8apache2_4.dll'));
if (!hasPhp) console.warn(`No PHP at ${linux ? httpdDir : phpDir}: contact-submit.php will not run.`);

const work = join(tmpdir(), `lulwa-apache-${port}`);
mkdirSync(join(work, 'logs'), { recursive: true });

if (hasPhp) {
  writeFileSync(
    join(work, 'php.ini'),
    [
      // Linux loads mbstring from the distro's conf.d scan dir.
      ...(linux ? [] : [`extension_dir="${fwd(join(phpDir, 'ext'))}"`, 'extension=mbstring']),
      'date.timezone=Asia/Riyadh',
      'display_errors=Off',
      `error_log="${fwd(join(work, 'logs', 'php-error.log'))}"`,
      // No mail server here: mail() fails fast, which is what the lead form must survive.
      'SMTP=127.0.0.1',
      'smtp_port=25',
    ].join('\n'),
  );
}

const modules = ['authz_core', 'authz_host', 'dir', 'mime', 'alias', 'rewrite', 'headers', 'deflate', 'brotli', 'expires', 'filter', 'env', 'setenvif', ...(linux ? ['mpm_prefork'] : ['log_config'])]; // Debian builds log_config in; its mod_php needs prefork
const phpLoad = linux
  ? `LoadModule php_module modules/${linuxPhp}`
  : `LoadFile "${fwd(join(phpDir, 'php8ts.dll'))}"\nLoadModule php_module "${fwd(join(phpDir, 'php8apache2_4.dll'))}"`;
const conf = `
ServerRoot "${fwd(httpdDir)}"
ServerName localhost:${port}
Listen 127.0.0.1:${port}
PidFile "${fwd(join(work, 'httpd.pid'))}"
${linux ? `DefaultRuntimeDir "${fwd(work)}"` : ''}
${modules.map((m) => `LoadModule ${m}_module modules/mod_${m}.so`).join('\n')}
${hasPhp ? `${phpLoad}\nPHPIniDir "${fwd(work)}"\nAddType application/x-httpd-php .php` : ''}
TypesConfig ${linux ? '/etc/mime.types' : 'conf/mime.types'}
DocumentRoot "${docroot}"
ErrorLog "${fwd(join(work, 'logs', 'error.log'))}"
LogLevel warn
LogFormat "%h %>s %r" brief
CustomLog "${fwd(join(work, 'logs', 'access.log'))}" brief
SetEnv LULWA_RATE_LIMIT 1000
# Each browser holds several keep-alive connections; 16 threads ran out with parallel Playwright workers.
<IfModule mpm_winnt_module>
ThreadsPerChild 250
</IfModule>
<Directory />
  AllowOverride None
  Require all denied
</Directory>
<Directory "${docroot}">
  AllowOverride All
  Require all granted
</Directory>
DirectoryIndex index.html
`;
writeFileSync(join(work, 'httpd.conf'), conf);

const child = spawn(httpdBin, ['-f', fwd(join(work, 'httpd.conf')), ...(linux ? ['-DFOREGROUND'] : [])],{ stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM', 'SIGBREAK']) process.on(signal, () => child.kill());
console.log(`Apache on http://localhost:${port} serving ${docroot}`);
