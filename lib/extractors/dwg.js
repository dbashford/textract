var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null
    , catdoc = spawn( "dwgdxftotext", [ filePath ] );

  catdoc.stdout.on( 'data', function( buffer ){
    result += buffer.toString();
  });

  catdoc.stderr.on( 'error', function( buffer ){
    if ( !error ) {
      error = '';
    }
    error += buffer.toString();
  });

  catdoc.on( 'close', function( code ){
    if ( error ) {
      error = new Error( "dwgdxftotext read of .dwg file named [[ " + filePath + " ]] failed: " + error.message );
      cb( error, null );
      return;
    }
    cb( null, result.trim() );
  });
}

var testForBinary = function() {
  exec('catdoc ' + __filename,
    function (error, stdout, stderr) {
      if (error !== null) {

        console.error( "textract: 'dwgdxftotext' does not appear to be installed, so it will be unable to extract DWGs." );
      }
  });
}

module.exports = {
  types: [
          "application/acad", 
          "application/x-acad",
          "application/autocad_dwg",
          "image/x-dwg",
          "application/dwg",
          "application/x-dwg",
          "application/x-autocad",
          "image/vnd.dwg",
          "drawing/dwg"
        ],
  extract: extractText,
  test: testForBinary
}