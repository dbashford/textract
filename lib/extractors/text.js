var fs = require( 'fs' )
  , iconv = require( 'iconv-lite' )
  , jschardet = require( 'jschardet' )
  ;

function extractText( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    var encoding, decoded;
    if ( error ) {
      cb( error, null );
      return;
    }
    try {
      encoding = jschardet.detect( data ).encoding.toLowerCase();
      decoded = iconv.decode( data, encoding );
    } catch ( e ) {
      cb( e );
      return;
    }
    cb( null, decoded );
  });
}

module.exports = {
  types: [/text\//, 'application/csv', 'application/javascript'],
  extract: extractText
};
