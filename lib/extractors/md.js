var fs = require( 'fs' )
  , marked = require( 'marked' )
  , htmlExtract = require( './html' )
  ;

function extractText( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if ( error ) {
      cb( error, null );
      return;
    }

    marked( data.toString(), function( err, content ) {
      if ( err ) {
        cb( err, null );
      } else {
        htmlExtract.extractFromText( content, options, cb );
      }
    });
  });
}

module.exports = {
  types: ['text/x-markdown', 'text/markdown'],
  extract: extractText
};
