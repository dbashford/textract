var exec = require( 'child_process' ).exec
  , os = require( 'os' )
  , path = require( 'path' )
  , htmlExtract = require( './html' )
  , util = require( '../util' )
  , types
  ;

function extractText( filePath, options, cb ) {
  var execOptions = util.createExecOptions( 'rtf', options )
    , escapedPath = filePath.replace( /\s/g, '\\ ' )
    ;

  // Going to output html from unrtf because unrtf does a great job of
  // going to html, but does a crap job of going to text. It leaves sections
  // out, strips apostrophes, leaves nasty quotes in for bullets and more
  // that I've likely not yet discovered.
  //
  // textract can go from html to text on its own, so let unrtf go to html
  // then extract the text from that
  //
  // Also do not have to worry about stripping comments from unrtf text
  // output since HTML comments are not included in output. Also, the
  // unrtf --quiet option doesn't work.
  exec( 'unrtf --html --nopict ' + escapedPath,
    execOptions,
    function( error, stdout /* , stderr */ ) {
      var err;
      if ( error ) {
        err = new Error( 'unrtf read of file named [[ ' +
          path.basename( filePath ) + ' ]] failed: ' + error );
        cb( err, null );
      } else {
        htmlExtract.extractFromText( stdout.trim(), {}, cb );
      }
    }
  );
}

function testForBinary( options, cb ) {
  // just non-osx extractor
  if ( os.platform() === 'darwin' ) {
    cb( true );
    return;
  }

  exec( 'unrtf ' + __filename,
    function( error /* , stdout, stderr */ ) {
      var msg;
      if ( error !== null && error.message &&
          error.message.indexOf( 'not found' ) !== -1 ) {
        msg = 'INFO: \'unrtf\' does not appear to be installed, ' +
          'so textract will be unable to extract RTFs.';
        cb( false, msg );
      } else {
        cb( true );
      }
    }
  );
}

// rely on native tools on osx
if ( os.platform() === 'darwin' ) {
  types = [];
  // types = ['application/rtf', 'text/rtf'];
} else {
  types = ['application/rtf', 'text/rtf'];
}

module.exports = {
  types: types,
  extract: extractText,
  test: testForBinary
};
