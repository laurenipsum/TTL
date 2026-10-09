/** written by Claude :( **/ 

/**
 * Format downloaded myTurn inventory export -- v0.2
 *
 * - Works by header name, so it copes with exports that are missing some fields.
 * - Header matching ignores case and ALL whitespace ("Amount / Fee" = "Amount/Fee").
 * - Runs on the active tab if row 1 looks like a myTurn export (has Item ID, Item Type, Name).
 * - Refuses to run twice (stops if a "To import?" header already exists).
 * - Cell contents are never edited: HTML and line breaks are kept exactly as exported.
 */
function formatNewInventoryExport() {
  // ---------- Settings ----------
  var VERSION = 'v0.2';

  var REQUIRED_HEADERS = ['Item ID', 'Item Type', 'Name']; // row 1 must contain all three

  var DELETE_HEADERS = [
    'Agreement that must be signed to checkout the item',
    'Amount / Fee',
    'Artist',
    'Author',
    'Color',
    'Copyright Year',
    'Custom Value',
    'Date Purchased',
    'Eco Rating',
    'Embodied Carbon',
    'Emission Factor',
    'Excluded Fulfillment Methods',
    'Featured',
    'Grace period on late fees (in days)',
    'Illustrator',
    'Maintenance Plan After Each Check In',
    'Max Frequency',
    'Max Frequency Units',
    'Max Output',
    'Min Frequency',
    'Min Frequency Units',
    'Product Code / UPC',
    'Publisher',
    'Purchased',
    'Serial Number',
    'Source / Supplier',
    'Tax(es)'
  ];

  var FIRST_COLUMN = 'To import?'; // new column A
  var NOTES_COLUMN = 'Notes / Questions'; // new column, placed where it appears in COLUMN_ORDER

  // Left-to-right order after the "To import?" column.
  var COLUMN_ORDER = [
    'Item ID',
    'Name',
    'Item Type',
    'Status(es)',
    'Categories',
    'Description',
    'Keywords',
    'Manufacturer',
    'Model',
    'Location Code',
    'Admin Check In Reminder',
    'Admin Check Out Reminder',
    'Admin Notes',
    'Attachment',
    'Image',
    'Additional Image',
    'Condition',
    'Size',
    'Weight',
    'Dimensions (WxHxD)',
    'Maximum number of renewals',
    'Default Loan Length',
    'Daily Late Fee',
    'Historical Cost',
    'Replacement Cost',
    NOTES_COLUMN,
    'Date Created',
    'Date Last Edited',
    'Date Last Updated'
  ];

  var COLUMN_WIDTHS = {
    'Item Type': 200,
    'Status(es)': 200,
    'Name': 200,
    'Admin Check In Reminder': 150,
    'Admin Check Out Reminder': 150,
    'Admin Notes': 200,
    'Categories': 150,
    'Description': 250,
    'Keywords': 200
  };
  var DEFAULT_WIDTH = 100; // every column not listed above

  var CLIP_HEADERS = ['Additional Image', 'Attachment', 'Image']; // everything else wraps
  var AUTOMATIC_FORMAT_HEADERS = ['Date Created', 'Date Last Edited', 'Date Last Updated']; // everything else is Text
  var HIDE_HEADERS = ['Date Created', 'Date Last Edited', 'Date Last Updated'];
  var SORT_HEADERS = ['Item Type', 'Name', 'Item ID']; // all A-Z, in this priority (blanks sort last)
  var FROZEN_COLUMNS = 3; // A through C

  // ---------- Helpers ----------
  // Lowercase and strip every kind of whitespace (including non-breaking and zero-width characters).
  function norm(s) { return String(s).replace(/[\s​-‍﻿]/g, '').toLowerCase(); }
  function toSet(list) {
    var set = {};
    list.forEach(function (h) { set[norm(h)] = true; });
    return set;
  }

  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getActiveSheet();

  // ---------- Is this an unformatted myTurn export? ----------
  var lastCol = sheet.getLastColumn();
  var headerKeys = lastCol < 1
    ? []
    : sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(norm);

  if (headerKeys.indexOf(norm(FIRST_COLUMN)) !== -1) {
    ui.alert('Formatting script has already been run, and cannot be run again.');
    return;
  }
  var missing = REQUIRED_HEADERS.filter(function (h) { return headerKeys.indexOf(norm(h)) === -1; });
  if (missing.length > 0) {
    ui.alert('This tab doesn\'t look like a myTurn inventory export (row 1 is missing: ' +
      missing.join(', ') + '). Nothing was changed.');
    return;
  }

  // ---------- Read ----------
  var source = sheet.getDataRange();
  var numRows = source.getNumRows();
  var raw = source.getValues();
  var display = source.getDisplayValues();
  var sourceHeaders = display[0];

  var firstIndex = {}; // normalized header -> 0-based column of its first occurrence
  sourceHeaders.forEach(function (h, i) {
    var key = norm(h);
    if (key !== '' && firstIndex[key] === undefined) firstIndex[key] = i;
  });

  // ---------- Work out the final layout ----------
  var finalHeaders = [FIRST_COLUMN];
  var finalSource = [-1]; // -1 = new blank column
  var finalKeys = [norm(FIRST_COLUMN)]; // null for columns the script doesn't recognize
  var used = {};

  COLUMN_ORDER.forEach(function (h) {
    if (norm(h) === norm(NOTES_COLUMN)) {
      finalHeaders.push(NOTES_COLUMN);
      finalSource.push(-1);
      finalKeys.push(norm(NOTES_COLUMN));
    } else if (firstIndex[norm(h)] !== undefined) {
      finalHeaders.push(h);
      finalSource.push(firstIndex[norm(h)]);
      finalKeys.push(norm(h));
      used[firstIndex[norm(h)]] = true;
    }
  });

  // Anything else is kept (never silently dropped) and placed at the far right.
  // Exceptions: columns on the delete list, and columns with no header and no data.
  var deleteSet = toSet(DELETE_HEADERS);
  var leftovers = [];
  for (var i = 0; i < sourceHeaders.length; i++) {
    if (used[i]) continue;
    var key = norm(sourceHeaders[i]);
    if (deleteSet[key]) continue;
    if (key === '') {
      var hasData = false;
      for (var r = 1; r < numRows; r++) {
        if (display[r][i] !== '') { hasData = true; break; }
      }
      if (!hasData) continue;
    }
    finalHeaders.push(sourceHeaders[i]);
    finalSource.push(i);
    finalKeys.push(null);
    leftovers.push(key === '' ? '(no header, column ' + (i + 1) + ')' : sourceHeaders[i]);
  }

  var numCols = finalHeaders.length;
  var automaticSet = toSet(AUTOMATIC_FORMAT_HEADERS);
  var clipSet = toSet(CLIP_HEADERS);
  var hideSet = toSet(HIDE_HEADERS);
  var widths = {};
  Object.keys(COLUMN_WIDTHS).forEach(function (h) { widths[norm(h)] = COLUMN_WIDTHS[h]; });

  // Build the new grid in memory first. Date columns keep their real values; the rest are written as text.
  // Values are copied as-is: no trimming, no HTML stripping, line breaks untouched.
  var out = [];
  for (var row = 0; row < numRows; row++) {
    var line = [];
    for (var c = 0; c < numCols; c++) {
      var s = finalSource[c];
      if (s === -1) {
        line.push(row === 0 ? finalHeaders[c] : '');
      } else if (row > 0 && finalKeys[c] !== null && automaticSet[finalKeys[c]]) {
        line.push(raw[row][s]);
      } else {
        line.push(display[row][s]);
      }
    }
    out.push(line);
  }

  // ---------- Reset the sheet ----------
  var oldFilter = sheet.getFilter();
  if (oldFilter) oldFilter.remove();
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
  sheet.showColumns(1, sheet.getMaxColumns());
  sheet.clear();
  if (sheet.getMaxColumns() < numCols) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), numCols - sheet.getMaxColumns());
  }

  // ---------- Write ----------
  // Text format must be set before the values go in, or Sheets will re-interpret them.
  var runStart = null;
  for (var k = 0; k <= numCols; k++) {
    var isText = k < numCols && !(finalKeys[k] !== null && automaticSet[finalKeys[k]]);
    if (isText && runStart === null) runStart = k;
    if (!isText && runStart !== null) {
      sheet.getRange(1, runStart + 1, numRows, k - runStart).setNumberFormat('@');
      runStart = null;
    }
  }
  var target = sheet.getRange(1, 1, numRows, numCols);
  target.setValues(out);

  if (sheet.getMaxColumns() > numCols) {
    sheet.deleteColumns(numCols + 1, sheet.getMaxColumns() - numCols);
  }

  // ---------- Format ----------
  target.setVerticalAlignment('top');
  target.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setColumnWidths(1, numCols, DEFAULT_WIDTH);
  for (var j = 0; j < numCols; j++) {
    var fk = finalKeys[j];
    if (fk === null) continue;
    var col = j + 1;
    if (clipSet[fk]) sheet.getRange(1, col, numRows, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    if (widths[fk]) sheet.setColumnWidth(col, widths[fk]);
    if (hideSet[fk]) sheet.hideColumns(col);
  }

  // ---------- Sort (header row excluded), then filter and freeze ----------
  if (numRows > 1) {
    var sortSpec = [];
    SORT_HEADERS.forEach(function (h) {
      var idx = finalKeys.indexOf(norm(h));
      if (idx !== -1) sortSpec.push({ column: idx + 1, ascending: true });
    });
    if (sortSpec.length > 0) sheet.getRange(2, 1, numRows - 1, numCols).sort(sortSpec);
  }

  sheet.getRange(1, 1, numRows, numCols).createFilter();
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(Math.min(FROZEN_COLUMNS, numCols));
  sheet.getRange('A1').activate();

  var message = VERSION + ' done.';
  if (leftovers.length > 0) {
    message += ' Columns the script doesn\'t know were left at the far right: ' + leftovers.join(', ');
  }
  ss.toast(message, 'Format export', 10);
}
