/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search'], function (search) {
  return {
    onRequest: function (context) {

      var html = '<!doctype html>' +
        '<html lang="en">' +
        '<head>' +
          '<meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width, initial-scale=1">' +
          '<title>Vendor Ledger</title>' +
          '<link rel="stylesheet" href="' + getFileUrl('vendor-ledger.css') + '">' +
        '</head>' +
        '<body>' +
          '<div id="root"></div>' +
          '<script src="' + getFileUrl('vendor-ledger.js') + '"></script>' +
        '</body>' +
        '</html>';

      context.response.write(html);

      function getFileUrl(filename) {
        var results = search.create({
          type: 'file',
          filters: [['name', 'is', filename]],
          columns: ['url']
        }).run().getRange({ start: 0, end: 1 });

        if (Array.isArray(results) && results.length > 0) {
          return results[0].getValue('url');
        }
      }
    }
  };
});