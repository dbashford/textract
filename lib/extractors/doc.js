var exec = require( 'child_process' ).exec
  , os = require( 'os' )
  , path = require( 'path' )
  ;

var extractText = function( filePath, options, cb ) {

  exec('antiword ' + filePath,
    function ( error, stdout /* , stderr */) {
      var err;
      if ( error ) {
        if ( error.toString().indexOf( 'is not a Word Document' ) ) {
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
};

var testForBinary = function( options, cb ) {
  // just non-osx extractor
  if ( os.platform() === 'darwin') {
    return cb( true );
  }

  exec('antiword ' + __filename,
    function ( error /* , stdout, stderr */ ) {
      var msg;
      if ( error !== null && error.message &&
          error.message.indexOf( 'antiword: No such file or directory' ) == -1 ) {
        msg = 'INFO: \'antiword\' does not appear to be installed, ' +
         'so textract will be unable to extract DOCs.';
        cb( false, msg );
      } else {
        cb( true );
      }
    }
  );
};

var types;
if ( os.platform() === 'darwin' ) {
  // for local testing
  // let textutil handle .doc on osx
  // types = ['application/msword'];
  types = [];
} else {
  types = ['application/msword'];
}

module.exports = {
  types: types,
  extract: extractText,
  test: testForBinary
};
