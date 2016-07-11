var exec = require( 'child_process' ).exec
  , path = require( 'path' )
  , util = require( '../util' )
  ;

function extractText( filePath, options, cb ) {
  var execOptions = util.createExecOptions( 'dxf', options )
    , escapedPath = filePath.replace( /\s/g, '\\ ' )
    ;

  exec( 'drawingtotext ' + escapedPath,
    execOptions,
    function( error, stdout, stderr ) {
      if ( stderr !== '' ) {
        error = new Error( 'error extracting DXF text ' +
          path.basename( filePath ) + ': ' + stderr );
        cb( error, null );
        return;
      }

      cb( null, stdout );
    }
  );
}

function testForBinary( options, cb ) {
  exec( 'drawingtotext notalegalfile',
    function( error, stdout, stderr ) {
      var msg
        , errorRegex = /I couldn't make sense of your input/
        ;

      if ( !( stderr && errorRegex.test( stderr ) ) ) {
        msg = 'INFO: \'drawingtotext\' does not appear to be installed, ' +
          'so textract will be unable to extract DXFs.';
        cb( false, msg );
      } else {
        cb( true );
      }
    }
  );
}

module.exports = {
  types: [
    'application/dxf',
    'application/x-autocad',
    'application/x-dxf',
    'drawing/x-dxf',
    'image/vnd.dxf',
    'image/x-autocad',
    'image/x-dxf',
    'zz-application/zz-winassoc-dxf'
  ],
  extract: extractText,
  test: testForBinary
};
