/**
 * Lulwa lead webhook. Bound to the "Lulwa leads" Google Sheet, owned by the shop's Google account.
 * The website Worker (worker/lead.ts) POSTs each validated lead here as JSON with the shared secret.
 * This script checks the secret, adds the lead as the top row, emails the shop and returns {ok: true}.
 * Script properties (Project Settings): SECRET = the Worker's LEADS_WEBHOOK_SECRET, SHOP_EMAIL = where leads are emailed.
 * Deploy steps: integrations/README.md.
 */

var SHEET_NAME = 'Leads';
var COLUMNS = ['Received', 'Reference', 'Status', 'Name', 'Mobile', 'WhatsApp', 'Appliance', 'District', 'Message', 'Page', 'Campaign', 'Notes'];
var STATUSES = ['New', 'Contacted', 'Done', 'Not a lead'];

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad_json' });
  }
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SECRET');
  if (!secret || data.secret !== secret) return reply({ ok: false, error: 'unauthorized' });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return reply({ ok: false, error: 'busy' });
  try {
    var s = sheet();
    s.insertRowAfter(1); // newest on top, under the header
    s.getRange(2, 1, 1, COLUMNS.length).setValues([[
      new Date(), cell(data.reference), 'New', cell(data.name), cell(data.phone),
      'https://wa.me/' + String(data.phone).replace(/^\+/, '').replace(/^00/, '').replace(/^0/, '966'),
      cell(data.appliance), cell(data.area), cell(data.message), cell(data.page), cell(data.utm), '',
    ]]);
    s.getRange(2, 3).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  // The row is saved; a failed email must not make the lead fail. The Worker logs emailError.
  var emailError = null;
  try {
    var to = props.getProperty('SHOP_EMAIL');
    if (!to) throw new Error('SHOP_EMAIL not set');
    MailApp.sendEmail({
      to: to,
      subject: 'New lead ' + data.reference + ': ' + data.appliance + ', ' + data.area,
      htmlBody: '<p><b>' + esc(data.name) + '</b>, ' + esc(data.phone) + '</p><p>' + esc(data.appliance) + ', ' + esc(data.area) + '</p><p>' +
        esc(data.message).replace(/\n/g, '<br>') + '</p><p>Page: ' + esc(data.page) + ' ' + esc(data.utm) + '</p>',
      name: 'Lulwa website',
    });
  } catch (err) {
    emailError = String(err);
  }
  return reply({ ok: true, emailSent: !emailError, emailError: emailError });
}

/** Run once from the editor: creates the sheet, forces the Mail permission, sends a test email. Adds no lead. */
function setup() {
  sheet();
  var to = PropertiesService.getScriptProperties().getProperty('SHOP_EMAIL');
  if (!to) throw new Error('Set the SHOP_EMAIL script property first');
  MailApp.sendEmail(to, 'Lulwa leads: test email', 'If you can read this, lead emails work.');
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(SHEET_NAME);
  if (!s) {
    s = ss.insertSheet(SHEET_NAME);
    s.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
    s.setFrozenRows(1);
  }
  return s;
}

// Text that starts with = + - @ could run as a formula in the Sheet: a leading apostrophe stores it as plain text.
function cell(v) {
  var t = v == null ? '' : String(v);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function esc(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
