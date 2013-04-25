var fs = require( 'fs' );

var extractText = function( filePath, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if (error) {
      cb( error, null );
      return;
    }
    cb( null, data );
  });
}

module.exports = {
  types: [/text\//],
  extract: extractText
}