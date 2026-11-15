/*
 * sheetsee.js (demo re-implementation)
 *
 * A tiny, dependency-free client-side library inspired by jlord/sheetsee.js.
 * It connects a published Google Spreadsheet to a web page and provides
 * helper methods for working with the resulting array-of-objects data.
 *
 * The original Sheetsee paired with Tabletop.js (which relied on the legacy
 * Google Spreadsheets API). This version fetches data through the modern
 * Google Visualization CSV endpoint:
 *
 *   https://docs.google.com/spreadsheets/d/<KEY>/gviz/tq?tqx=out:csv&sheet=<NAME>
 *
 * The data-manipulation methods mirror the sheetsee-core API so the examples
 * from the original docs behave the same way.
 */
(function (global) {
  'use strict';

  var Sheetsee = {};

  // --- Data loading -------------------------------------------------------

  // Build the Google Visualization CSV export URL for a spreadsheet key.
  Sheetsee.buildCsvUrl = function (key, sheetName) {
    var base = 'https://docs.google.com/spreadsheets/d/' +
      encodeURIComponent(key) + '/gviz/tq?tqx=out:csv';
    if (sheetName) {
      base += '&sheet=' + encodeURIComponent(sheetName);
    }
    return base;
  };

  // Fetch a published Google Sheet and return its rows as an array of objects.
  // Mirrors the shape Tabletop.js used to deliver: row one becomes the keys.
  Sheetsee.loadSheet = function (options) {
    var key = options && options.key;
    if (!key) {
      return Promise.reject(new Error('A spreadsheet key is required.'));
    }
    var url = Sheetsee.buildCsvUrl(key, options.sheetName);
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to fetch spreadsheet (HTTP ' + res.status + ').');
      }
      return res.text();
    }).then(function (text) {
      return Sheetsee.parseCSV(text);
    });
  };

  // --- CSV parsing --------------------------------------------------------

  // Parse CSV text into an array of row arrays. Handles quoted fields,
  // escaped quotes ("") and both \n and \r\n line endings.
  Sheetsee.parseRows = function (text) {
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    var i = 0;
    var len = text.length;

    while (i < len) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i += 1;
          continue;
        }
        field += ch;
        i += 1;
        continue;
      }

      if (ch === '"') {
        inQuotes = true;
        i += 1;
        continue;
      }
      if (ch === ',') {
        row.push(field);
        field = '';
        i += 1;
        continue;
      }
      if (ch === '\r') {
        i += 1;
        continue;
      }
      if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
    }

    // Flush the final field/row if the file did not end with a newline.
    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  };

  // Convert CSV text into an array of objects keyed by the header row.
  Sheetsee.parseCSV = function (text) {
    var rows = Sheetsee.parseRows(text);
    if (rows.length === 0) {
      return [];
    }
    var headers = rows[0].map(function (h) {
      return String(h).trim();
    });
    var data = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      // Skip completely empty lines.
      if (cells.length === 1 && cells[0].trim() === '') {
        continue;
      }
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        if (!headers[c]) {
          continue;
        }
        obj[headers[c]] = cells[c] !== undefined ? cells[c] : '';
      }
      obj.rowNumber = data.length + 1;
      data.push(obj);
    }
    return data;
  };

  // --- Helpers ------------------------------------------------------------

  function toNumber(value) {
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }

  function matchesKeyword(value, keyword) {
    return String(value).toLowerCase().indexOf(String(keyword).toLowerCase()) !== -1;
  }

  // --- sheetsee-core data methods ----------------------------------------

  // Number of times a keyword occurs across every cell of the data.
  Sheetsee.getKeywordCount = function (data, keyword) {
    var count = 0;
    data.forEach(function (row) {
      Object.keys(row).forEach(function (col) {
        if (col === 'rowNumber') {
          return;
        }
        if (matchesKeyword(row[col], keyword)) {
          count += 1;
        }
      });
    });
    return count;
  };

  // Every row that contains a match to the keyword in any column.
  Sheetsee.getKeyword = function (data, keyword) {
    return data.filter(function (row) {
      return Object.keys(row).some(function (col) {
        return col !== 'rowNumber' && matchesKeyword(row[col], keyword);
      });
    });
  };

  // Sum of every cell in a numeric column.
  Sheetsee.getColumnTotal = function (data, column) {
    return data.reduce(function (sum, row) {
      return sum + toNumber(row[column]);
    }, 0);
  };

  // Average value of a numeric column.
  Sheetsee.getColumnAverage = function (data, column) {
    if (data.length === 0) {
      return 0;
    }
    return Sheetsee.getColumnTotal(data, column) / data.length;
  };

  // Rows holding the lowest value within a column.
  Sheetsee.getMin = function (data, column) {
    if (data.length === 0) {
      return [];
    }
    var min = Math.min.apply(null, data.map(function (row) {
      return toNumber(row[column]);
    }));
    return data.filter(function (row) {
      return toNumber(row[column]) === min;
    });
  };

  // Rows holding the highest value within a column.
  Sheetsee.getMax = function (data, column) {
    if (data.length === 0) {
      return [];
    }
    var max = Math.max.apply(null, data.map(function (row) {
      return toNumber(row[column]);
    }));
    return data.filter(function (row) {
      return toNumber(row[column]) === max;
    });
  };

  // Every row where the given column matches the filter term.
  Sheetsee.getMatches = function (data, filter, column) {
    return data.filter(function (row) {
      return matchesKeyword(row[column], filter);
    });
  };

  // Object of { value: occurrences } for a column.
  Sheetsee.getOccurance = function (data, column) {
    var result = {};
    data.forEach(function (row) {
      var value = row[column];
      if (value === undefined || value === '') {
        return;
      }
      result[value] = (result[value] || 0) + 1;
    });
    return result;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sheetsee;
  } else {
    global.Sheetsee = Sheetsee;
  }
})(typeof window !== 'undefined' ? window : this);
