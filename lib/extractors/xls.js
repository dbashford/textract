var path = require( 'path' )
  , J = require( 'j' );

var extractText = function( filePath, options, cb ) {
  var CSVs;

  try {
    var wb = J.readFile( filePath );
    CSVs = J.utils.to_csv(wb);
  } catch ( error ) {
    error = new Error("Could not extract " + path.basename( filePath ) + ", " + error);
    cb( error, null );
    return;
  }

  var result = '';
  Object.keys( CSVs ).forEach( function( key ) {
    result += CSVs[ key ];
  });

  cb( null, result );
};

module.exports = {
  types: ["application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
          "application/vnd.ms-excel.sheet.macroEnabled.12"],
  extract: extractText
};
