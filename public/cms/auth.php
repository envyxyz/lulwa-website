<?php
/**
 * GitHub sign-in for the blog CMS at https://cms.lulwa.com.sa (Sveltia CMS, public/cms/index.html), as the Sveltia/Decap OAuth handshake expects.
 * 1. /auth.php?provider=github  -> redirect to GitHub with a one-time state cookie.
 * 2. GitHub returns ?code&state     -> swap the code for a token, check the GitHub user is on the allow list,
 *    then hand the token to the CMS window with postMessage.
 *
 * Secrets live outside public_html, in lulwa-cms.ini beside public_html, under both hosts (never in the repo):
 *   client_id = "..."            ; GitHub OAuth App, callback URL https://cms.lulwa.com.sa/auth.php
 *   client_secret = "..."
 *   allowed_users = "login1,login2"   ; GitHub usernames of the client's team (they also need write access to the repo)
 */
declare(strict_types=1);

const SITE = 'https://cms.lulwa.com.sa';
const CALLBACK = SITE . '/auth.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function finish(string $state, array $content): never
{
    $message = json_encode('authorization:github:' . $state . ':' . json_encode($content), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    $site = json_encode(SITE);
    $note = $state === 'success' ? 'Signed in. You can close this window.' : 'Sign-in failed: ' . htmlspecialchars((string) ($content['error'] ?? ''), ENT_QUOTES);
    header('Content-Type: text/html; charset=utf-8');
    echo "<!doctype html><meta charset=\"utf-8\"><title>Lulwa CMS</title><p>{$note}</p><script>
      (() => {
        const site = {$site};
        window.addEventListener('message', ({ data, origin }) => {
          if (origin === site && data === 'authorizing:github') window.opener?.postMessage({$message}, site);
        });
        window.opener?.postMessage('authorizing:github', site);
      })();
    </script>";
    exit;
}

$ini = dirname(__DIR__, 2) . '/lulwa-cms.ini';
$cfg = is_readable($ini) ? parse_ini_file($ini) : false;
if (!$cfg || empty($cfg['client_id']) || empty($cfg['client_secret']) || empty($cfg['allowed_users'])) {
    finish('error', ['provider' => 'github', 'error' => 'CMS sign-in is not set up on the server yet (lulwa-cms.ini).']);
}

// Step 1: start.
if (!isset($_GET['code'])) {
    if (($_GET['provider'] ?? 'github') !== 'github') finish('error', ['provider' => 'github', 'error' => 'Unsupported provider.']);
    $state = bin2hex(random_bytes(16));
    setcookie('lulwa_cms_state', $state, ['expires' => time() + 600, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
    $query = http_build_query(['client_id' => $cfg['client_id'], 'redirect_uri' => CALLBACK, 'scope' => 'repo', 'state' => $state, 'allow_signup' => 'false']);
    header('Location: https://github.com/login/oauth/authorize?' . $query, true, 302);
    exit;
}

// Step 2: callback.
$cookie = (string) ($_COOKIE['lulwa_cms_state'] ?? '');
setcookie('lulwa_cms_state', '', ['expires' => 1, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
if ($cookie === '' || !hash_equals($cookie, (string) ($_GET['state'] ?? ''))) {
    finish('error', ['provider' => 'github', 'error' => 'Sign-in expired. Close this window and try again.']);
}

function github(string $url, array $headers, ?array $post = null): ?array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => array_merge(['Accept: application/json', 'User-Agent: lulwa-cms-auth'], $headers),
    ]);
    if ($post !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
    }
    $body = curl_exec($ch);
    curl_close($ch);
    $data = is_string($body) ? json_decode($body, true) : null;
    return is_array($data) ? $data : null;
}

$token = github('https://github.com/login/oauth/access_token', [], [
    'client_id' => $cfg['client_id'],
    'client_secret' => $cfg['client_secret'],
    'code' => (string) $_GET['code'],
    'redirect_uri' => CALLBACK,
])['access_token'] ?? null;
if (!is_string($token) || $token === '') finish('error', ['provider' => 'github', 'error' => 'GitHub did not return a token.']);

// Only the client's team: the GitHub login must be on the allow list.
$login = strtolower((string) (github('https://api.github.com/user', ['Authorization: Bearer ' . $token])['login'] ?? ''));
$allowed = array_filter(array_map(fn ($u) => strtolower(trim($u)), explode(',', (string) $cfg['allowed_users'])));
if ($login === '' || !in_array($login, $allowed, true)) {
    finish('error', ['provider' => 'github', 'error' => 'This GitHub account is not allowed to edit the Lulwa blog.']);
}

finish('success', ['provider' => 'github', 'token' => $token]);
