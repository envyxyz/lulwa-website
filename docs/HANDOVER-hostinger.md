# Hostinger handover

Done: url-map.csv, redirects.mjs (.htaccess), postbuild, package-hostinger (zip untested), contact-submit.php, error-en.php, logs/, serve-apache, Worker removed, lib/redirects/lead specs, LeadForm path, playwright config. Real Apache ran: 153 passed; failures only on missing routes.

Not done: test-contract.mjs update, zip run and listing, rate-limit check, rerun specs on the fresh build.

Run: set HTTPD_DIR=C:\Users\ameer\AppData\Local\Temp\claude\c--Users-ameer-Desktop-lulwa\02cd0664-272d-4f2e-b0c8-52095807be0f\scratchpad\httpd\Apache24 and PW_DOCROOT=...\scratchpad\hostinger-out (run postbuild first), then pnpm exec playwright test tests/redirects.spec.ts tests/lead.spec.ts. PHP sits in ...\scratchpad\httpd\php.
