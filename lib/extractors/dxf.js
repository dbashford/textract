var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null;
    // , drawingtotext = spawn( "drawingtotext", [ filePath ] );

  exec( "drawingtotext " + filePath,
    { maxBuffer: 50000*1024 },
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "error extracting DXF text: " + error );
        cb( error, null );
        return;
      }

      cb( null, stdout );
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