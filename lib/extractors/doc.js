var spawn = require('child_process').spawn
  , exec = require('child_process').exec
  , os = require('os');

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null
    , catdoc
    , catdocArgs = [ filePath ];

  if (options.disableCatdocWordWrap === false) {
    catdocArgs.push( '-w' );
  }

  catdoc = spawn( "catdoc", catdocArgs )

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
      error = new Error( "catdoc read of file named [[ " + filePath + " ]] failed: " + error.message );
      cb( error, null );
      return;
    }
    cb( null, result.trim() );
  });
};

var testForBinary = function( cb ) {
  // just non-osx extractor
  if ( os.platform() === "darwin") {
    return cb( true );
  }

  exec('catdoc ' + __filename,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.error( "textract: 'catdoc' does not appear to be installed, so it will be unable to extract DOCs." );
      }
      cb( error === null );
    }
  );
};

var types;
if ( os.platform() === "darwin") {
  types = [];
} else {
  types = ["application/msword", "application/rtf", "text/rtf"];
}

module.exports = {
  types: types,
  extract: extractText,
  test: testForBinary
};
