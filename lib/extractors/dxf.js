var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null
    , drawingtotext = spawn( "drawingtotext", [ filePath ] );

  drawingtotext.stdout.on( 'data', function( buffer ){
    result += buffer.toString();
  });

  drawingtotext.stderr.on( 'error', function( buffer ){
    if ( !error ) {
      error = '';
    }
    error += buffer.toString();
  });

  drawingtotext.on( 'close', function( code ){
    if ( error ) {
      error = new Error( "drawingtotext read of .dxf file named [[ " + filePath + " ]] failed: " + error.message );
      cb( error, null );
      return;
    }
    cb( null, result.trim() );
  });
}

var testForBinary = function() {
  exec('drawingtotext ' + __filename,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.error( "textract: 'drawingtotext' does not appear to be installed, so it will be unable to extract DXFs." );
      }
  });
}

module.exports = {
  types: [
          "application/dxf",
          "application/x-autocad",
          "application/x-dxf",
          "drawing/x-dxf",
          "image/vnd.dxf",
          "image/x-autocad",
          "image/x-dxf",
          "zz-application/zz-winassoc-dxf"
        ],
  extract: extractText,
  test: testForBinary
}