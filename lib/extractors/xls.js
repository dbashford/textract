var exec = require( 'child_process' ).exec
  , path = require( 'path' )
  ;

var extractText = function( filePath, options, cb ) {
  var jBin = path.join( __dirname, '../../node_modules/j/bin/j.njs' ) + ' ' + filePath;
  var sedCmd = 'sed -';
  sedCmd += process.platform === 'darwin' ? 'E' : 'r';
  sedCmd += " 's/,+$//g'";
  exec(jBin + ' | ' + sedCmd,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error("Could not extract " + path.basename( filePath ) + ", " + error.message);
        cb( error, null );
        return;
      }

      cb( null, stdout );
  });
};

module.exports = {
  types: ["application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    "application/vnd.oasis.opendocument.spreadsheet-template"
  ],
  extract: extractText
};