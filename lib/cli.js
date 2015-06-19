var path = require( 'path' )
  , textract = require( './index' );

module.exports = function( filePath, flags ) {
  var filePath = path.resolve( process.cwd(), filePath );

  for (var flag in flags) {
    if (flags[flag] !== undefined) {
      flags[flag] = ( flags[flag] === "true" );
    }
  }

  if ( flags.preserveLineBreaks === undefined ) {
    flags.preserveLineBreaks = true;
  }

  textract( filePath, flags, function( error, text ) {
    if ( error ) {
      console.error( error );
    } else {
      console.log( text );
    }
  });
};
