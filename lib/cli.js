var path = require( 'path' )
  , textract = require( './index' );

module.exports = function( filePath, flags ) {
  filePath = path.resolve( process.cwd(), filePath );

  if ( flags.preserveLineBreaks === undefined ) {
    flags.preserveLineBreaks = true;
  }

  textract.fromFileWithPath( filePath, flags, function( error, text ) {
    if ( error ) {
      console.error( error );
    } else {
      console.log( text );
    }
  });
};
