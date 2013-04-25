var spawn = require('child_process').spawn;

var extractText = function( filePath, cb ) {
  var result = ''
    , error = null
    , catdoc = spawn( "catdoc", [ filePath ] );

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
      error = new Error( "catdoc read of .doc file named [[ " + filePath + " ]] failed: " + error.message );
      cb( error, null );
      return;
    }
    cb( null, result.trim() );
  });
}

module.exports = {
  types: ["application/msword"],
  extract: extractText
}