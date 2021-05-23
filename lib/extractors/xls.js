var path = require( 'path' )
  , xlsx = require( 'xlsx' );

function extractText( filePath, options, cb ) {
  var CSVs = {}
    , wb, result, error, sheet;

  try {
    wb = xlsx.readFile( filePath );
    Object.keys( wb.Sheets ).forEach( function( key ) {
      sheet = wb.Sheets[key];
      CSVs[key] = xlsx.utils.sheet_to_csv( sheet );
    });
  } catch ( err ) {
    error = new Error( 'Could not extract ' + path.basename( filePath ) + ', ' + err );
    cb( error, null );
    return;
  }

  result = '';
  Object.keys( CSVs ).forEach( function( key ) {
    result += CSVs[key];
  });

  cb( null, result );
}

module.exports = {
  types: ['application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.oasis.opendocument.spreadsheet-template'
  ],
  extract: extractText
};
