var spawn = require('child_process').spawn
  , exec = require('child_process').exec
  , path = require('path')
  , util = require('../util')
  ;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null;

  var execOptions = util.createExecOptions("dxf", options);

  exec( "drawingtotext " + filePath,
    execOptions,
    function ( error, stdout, stderr ) {
      if ( stderr !== "" ) {
        error = new Error( "error extracting DXF text " + path.basename( filePath ) + ": " + stderr );
        cb( error, null );
        return;
      }

      cb( null, stdout );
    }
  );
};

var testForBinary = function( cb ) {
  exec('drawingtotext notalegalfile',
    function ( error, stdout, stderr ) {
      var errorRegex = /I couldn't make sense of your input/;
      if( !( stderr && errorRegex.test( stderr ) ) ) {
        console.error( "textract: 'drawingtotext' does not appear to be installed, so it will be unable to extract DXFs." );
        cb( false );
      } else {
        cb ( true );
      }
    }
  );
};

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
};
