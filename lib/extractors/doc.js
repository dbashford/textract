var exec = require( 'child_process' ).exec
  , os = require( 'os' )
  , path = require( 'path' )
  , util = require( '../util' )
  , types
  ;

function extractText( filePath, options, cb ) {
  var execOptions = util.createExecOptions( 'doc', options );

  exec( 'antiword -m UTF-8.txt "' + filePath + '"',
    execOptions,
    function( error, stdout /* , stderr */ ) {
      var err;
      if ( error ) {
        if ( error.toString().indexOf( 'is not a Word Document' ) > 0 ) {
          err = new Error( 'file named [[ ' + path.basename( filePath ) +
            ' ]] does not appear to really be a .doc file' );
        } else {
          err = new Error( 'antiword read of file named [[ ' +
            path.basename( filePath ) + ' ]] failed: ' + error );
        }
        cb( err, null );
      } else {
        cb( null, stdout.trim().replace( /\[pic\]/g, '' ) );
      }
    }
  );
}

function testForBinary( options, cb ) {
  var execOptions;

  // just non-osx extractor
  if ( os.platform() === 'darwin' ) {
    cb( true );
    return;
  }

  execOptions = util.createExecOptions( 'doc', options );

  exec( 'antiword -m UTF-8.txt ' + __filename,
    execOptions,
    function( error /* , stdout, stderr */ ) {
      var msg;
      if ( error !== null && error.message &&
        error.message.indexOf( 'not found' ) !== -1 ) {
        msg = 'INFO: \'antiword\' does not appear to be installed, ' +
         'so textract will be unable to extract DOCs.';
        cb( false, msg );
      } else {
        cb( true );
      }
    }
  );
}

if ( os.platform() === 'darwin' ) {
  // for local testing
  // let textutil handle .doc on osx
  types = [];
  // types = ['application/msword'];
} else {
  types = ['application/msword'];
}

module.exports = {
  types: types,
  extract: extractText,
  test: testForBinary
};
