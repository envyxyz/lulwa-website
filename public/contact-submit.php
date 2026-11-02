<?php
/**
 * Lead form handler: POST /contact-submit.php (same origin, JSON body from src/components/LeadForm.astro).
 * - Validation matches the form: name, phone, appliance and area are required; message is optional.
 * - Same-origin check (Origin, else Referer), honeypot ("website"), per-IP rate limit.
 * - The lead is written to logs/contact-submissions.log FIRST (logs/ is closed by .htaccess), then sent with mail().
 * - Answers JSON: {ok:true, reference} or {ok:false, error, whatsapp?}. A bot gets the same answer as a person and nothing is stored.
 */
declare(strict_types=1);

const CONTACT_TO = 'lulwadammam@gmail.com';   // owner-approved business inbox (2026-10-31)
const CONTACT_FROM = 'no-reply@lulwa.com.sa';  // must be a mailbox on the domain that Hostinger allows for mail()
const SITE_HOST = 'lulwa.com.sa';
const WHATSAPP = 'https://wa.me/966568022197';
const MAX_BODY = 32768;
const RATE_LIMIT_PER_HOUR = 20;                // generous: many phones share one carrier IP

function reply(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function len(string $v): int
{
    return function_exists('mb_strlen') ? mb_strlen($v) : strlen($v);
}

function cut(string $v, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method']);
}

// Same-origin check. A browser always sends Origin (or at least Referer) on a POST, so another site's form cannot post here.
$source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$sourceHost = $source !== '' ? parse_url($source, PHP_URL_HOST) : null;
$ownHost = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
$allowed = [SITE_HOST, 'www.' . SITE_HOST, 'localhost', '127.0.0.1', '[::1]', '::1', strtolower((string) $ownHost)];
if (!is_string($sourceHost) || $sourceHost === '' || !in_array(strtolower($sourceHost), $allowed, true)) {
    reply(403, ['ok' => false, 'error' => 'origin']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY) {
    reply(413, ['ok' => false, 'error' => 'size']);
}
$raw = (string) file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
if (strlen($raw) > MAX_BODY) {
    reply(413, ['ok' => false, 'error' => 'size']);
}
// The form sends JSON; a plain urlencoded post is accepted too.
$in = ltrim($raw) !== '' && ltrim($raw)[0] === '{' ? json_decode($raw, true) : $_POST;
if (!is_array($in)) {
    reply(400, ['ok' => false, 'error' => 'invalid']);
}

$str = static fn(string $key): string => is_string($in[$key] ?? null) ? trim($in[$key]) : '';
$name = $str('name');
$phone = $str('phone');
$appliance = $str('appliance');
$area = $str('area');
$message = $str('message');
$page = $str('page');
$utm = $str('utm');
$honeypot = $str('website');

$bad = [];
// No control characters or angle brackets; single-line fields also take no line breaks.
$line = static fn(string $v, int $min, int $max): bool => len($v) >= $min && len($v) <= $max && preg_match('/^[^\p{Cc}<>]*$/u', $v) === 1;
if (!$line($name, 1, 80)) { $bad[] = 'name'; }
$digits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($phone) > 24 || preg_match('/^\+?[\d\s-]{8,24}$/', $phone) !== 1 || strlen($digits) < 8 || strlen($digits) > 15) { $bad[] = 'phone'; }
if (!$line($appliance, 1, 60)) { $bad[] = 'appliance'; }
if (!$line($area, 1, 60)) { $bad[] = 'area'; }
if (len($message) > 1000 || preg_match('/^(?:[^\p{Cc}<>]|[\n\t\r])*$/u', $message) !== 1) { $bad[] = 'message'; }
if (!$line($page, 0, 80)) { $bad[] = 'page'; }
if (!$line($utm, 0, 80)) { $bad[] = 'utm'; }
if (len($honeypot) > 200) { $bad[] = 'website'; }
if ($bad) {
    reply(400, ['ok' => false, 'error' => 'invalid', 'fields' => $bad]);
}

$reference = 'L-' . strtoupper(bin2hex(random_bytes(4)));
// A bot gets the same answer as a person and nothing is stored.
if ($honeypot !== '') {
    reply(200, ['ok' => true, 'reference' => $reference]);
}

$whatsapp = WHATSAPP . '?text=' . rawurlencode(trim($appliance . ', ' . $area . '. ' . $message) . ' [' . ($page !== '' ? $page : 'contact') . ' ' . $reference . ']');

// Per-IP rate limit (file based, hashed IP). Counter files older than three hours are removed on the way.
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0750, true);
}
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$limit = (int) ($_SERVER['LULWA_RATE_LIMIT'] ?? getenv('LULWA_RATE_LIMIT') ?: RATE_LIMIT_PER_HOUR);
$rateFile = $logDir . '/contact-rate-' . substr(hash('sha256', $ip . date('YmdH')), 0, 16) . '.cnt';
foreach (glob($logDir . '/contact-rate-*.cnt') ?: [] as $old) {
    if (@filemtime($old) < time() - 10800) { @unlink($old); }
}
$count = is_file($rateFile) ? (int) file_get_contents($rateFile) : 0;
if ($count >= $limit) {
    reply(429, ['ok' => false, 'error' => 'rate', 'reference' => $reference, 'whatsapp' => $whatsapp]);
}
@file_put_contents($rateFile, (string) ($count + 1), LOCK_EX);

// Save the lead first so it is never lost, then try the email.
$saved = false !== @file_put_contents(
    $logDir . '/contact-submissions.log',
    json_encode([
        'at' => date('c'), 'reference' => $reference, 'name' => $name, 'phone' => $phone, 'appliance' => $appliance,
        'area' => $area, 'message' => $message, 'page' => $page, 'utm' => $utm, 'ip_hash' => substr(hash('sha256', $ip), 0, 12),
    ], JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

// Number for the click-to-chat link in the email: 05xxxxxxxx, 5xxxxxxxx and 00966... all become 966...
$waNumber = match (true) {
    str_starts_with($digits, '00966') => substr($digits, 2),
    str_starts_with($digits, '05') => '966' . substr($digits, 1),
    strlen($digits) === 9 && $digits[0] === '5' => '966' . $digits,
    default => $digits,
};
$subject = '=?UTF-8?B?' . base64_encode('طلب جديد من الموقع - ' . $name . ' - ' . $reference) . '?=';
$body = "المرجع: {$reference}\nالاسم: {$name}\nالجوال: {$phone}\nواتساب: https://wa.me/{$waNumber}\nالجهاز: {$appliance}\nالمنطقة: {$area}\n\nالرسالة:\n{$message}\n\nالصفحة: " . ($page !== '' ? $page : 'contact') . ($utm !== '' ? "\nالحملة: {$utm}" : '') . "\n\n--\nأُرسلت من https://" . SITE_HOST . ' في ' . date('Y-m-d H:i');
$headers = implode("\r\n", [
    'From: ' . CONTACT_FROM,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: lulwa-contact',
]);
$mailed = function_exists('mail') && @mail(CONTACT_TO, $subject, $body, $headers, '-f' . CONTACT_FROM);

if ($saved || $mailed) {
    // The lead exists somewhere safe, so the visitor is thanked. `mailed` says whether the shop's inbox also got it.
    reply(200, ['ok' => true, 'reference' => $reference, 'saved' => $saved, 'mailed' => $mailed]);
}
// Neither worked: be honest and send the visitor to WhatsApp with the message ready.
reply(502, ['ok' => false, 'error' => 'delivery', 'reference' => $reference, 'whatsapp' => $whatsapp]);
