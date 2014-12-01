var path = require( 'path' )
  , textract = require( './index' );

module.exports = function( filePath, flags ) {
  var filePath = path.resolve( process.cwd(), filePath );
  textract( filePath, { preserveLineBreaks: true }, function( error, text ) {
    if ( error ) {
      console.error( error );
    } else {
      console.log( text );
    }
  });
};
