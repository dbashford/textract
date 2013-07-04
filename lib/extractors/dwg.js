var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null
    , drawingtotext = spawn( "drawingtotext", [ filePath ] );

  drawingtotext.stdout.on( 'data', function( buffer ){
    console.log("buffer: ", buffer);
    result += buffer.toString();
  });

  drawingtotext.stderr.on( 'error', function( buffer ){
    console.log("error: ", error);
    if ( !error ) {
      error = '';
    }
    error += buffer.toString();
  });

  drawingtotext.on( 'close', function( code ){
    if ( error ) {
      error = new Error( "drawingtotext read of .dwg file named [[ " + filePath + " ]] failed: " + error.message );
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

        console.error( "textract: 'drawingtotext' does not appear to be installed, so it will be unable to extract DWGs." );
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