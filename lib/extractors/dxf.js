var spawn = require('child_process').spawn
  , exec = require('child_process').exec;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null;

  exec( "drawingtotext " + filePath,
    { maxBuffer: 50000*1024 },
    function ( error, stdout, stderr ) {
      if ( stderr !== "" ) {
        error = new Error( "error extracting DXF text: " + stderr );
        cb( error, null );
        return;
      }

      cb( null, stdout );
    });
}

var testForBinary = function() {
  exec('drawingtotext notalegalfile',
    {maxBuffer: 50000*1024},
    function (error, stdout, stderr) {
        var errorRegex = /I couldn't make sense of your input/;
        if(!(stderr && errorRegex.test(stderr))) {
            console.error( "textract: 'drawingtotext' does not appear to be installed, so it will be unable to extract DWGs." );
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
