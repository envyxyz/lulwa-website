<?php
// English 404 for /en/*. .htaccess rewrites a missing /en/ URL here; the status stays 404 and the page is en/404.html.
http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');
header('X-Robots-Tag: noindex, noarchive, nosnippet');
$page = __DIR__ . '/en/404.html';
readfile(is_file($page) ? $page : __DIR__ . '/404.html');
