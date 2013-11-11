var fs = require( 'fs' );

var extractText = function( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if ( error ) {
      cb( error, null );
      return;
    }
    cb( null, data.toString() );
  });
};

module.exports = {
  types: [/text\//, "application/javascript"],
  extract: extractText
};