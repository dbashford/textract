var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null
    , xls2csv = spawn( "xls2csv", [ filePath ] );

  xls2csv.stdout.on( 'data', function( buffer ){
    result += buffer.toString();
  });

  xls2csv.stderr.on( 'error', function( buffer ){
    if ( !error ) {
      error = '';
    }
    error += buffer.toString();
  });

  xls2csv.on( 'close', function( code ){
    if ( error ) {
      error = new Error( "xls2csv read of file named [[ " + filePath + " ]] failed: " + error.message );
      cb( error, null );
      return;
    }
    cb( null, result.trim() );
  });
};

var testForBinary = function( cb ) {
  exec( 'xls2csv ' + __filename,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        console.error( "textract: 'xls2csv' does not appear to be installed, so it will be unable to extract XLSs." );
      }
      cb( error === null );
    }
  );
};

module.exports = {
  types: ["application/vnd.ms-excel"],
  extract: extractText,
  test: testForBinary
};