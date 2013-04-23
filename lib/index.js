var fs = require( 'fs' )
  , path = require( 'path' )
  , mime = require('mime');
  , extractorPath = path.join( __dirname, "extractors" )
  , extractors = {};

var extractWithType = function( type, filePath, cb ) {
  if ( extractors[type] ) {
    extractors[type]( filePath, cb );
  } else {
    var error = "textract does not extract files of type [[ " + type " ]]";
    error.typeNotFound = true
    cb( error , null );
  }
}

fs.readdirSync( extractorPath ).forEach( function(item) {
  var fullPath = path.join( extractorPath, item )
  var extractor = require( fullPath );
  extractor.types.forEach( function( type) {
    extractors[type] = extractor.extract;
  });
});

module.exports = function( type, filePath, cb ) {
  if ( typeof cb === "function" && typeof type === "string" && typeof filePath === "string" ) {
    extractWithType( type, filePath, cb )
  } else {
    if ( typeof filePath === "function" && typeof type === "string" ) {
      cb = filePath;
      filePath = type;
      type = mime.lookup( filePath );
      extractWithType( type, filePath, cb );
    } else {
      console.error( "Incorrect parameters passed to textract." );
      console.log( "Signatures:" );
      console.log( "  textract(filePath, callback)" );
      console.log( "  textract(mimeType, filePath, callback)" );
      cb( "Incorrect parameters passed to textract.", null );
    }
  }
}