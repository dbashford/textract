var fs = require( 'fs' )
  , path = require( 'path' )
  , extractorPath = path.join( __dirname, "extractors" )
  , extractors = {};

fs.readdirSync( extractorPath ).map( function( item ) {
  var fullPath = path.join( extractorPath, item )
  return require( fullPath );
}).forEach( function( extractor ) {
  extractor.types.forEach( function( type ) {
    if (typeof type === "string") {
      extractors[type] = extractor.extract;
    }
  });
});

module.exports = {
  extractors: extractors
}