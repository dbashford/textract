var fs = require( 'fs' )
  , path = require( 'path' )
  , mime = require('mime')
  , extractorPath = path.join( __dirname, "extractors" )
  , extractors = {};

fs.readdirSync( extractorPath ).forEach( function(item) {
  var fullPath = path.join( extractorPath, item )
  var extractor = require( fullPath );
  extractor.types.forEach( function( type) {
    extractors[type] = extractor.extract;
  });
});

var extractWithType = function( type, filePath, cb ) {
  // first test to make sure file exists

  fs.exists( filePath, function( exists ) {
    if ( exists ) {
      if ( extractors[type] ) {
        extractors[type]( filePath, cb );
      } else {
        var error = new Error( "textract does not currently extract files of type [[ " + type + " ]]" );
        error.typeNotFound = true
        cb( error , null );
      }
    } else {
      cb( new Error( "File at path [[ " + filePath + " ]] does not exist" ), null );
    }
  });

}

var textract = function( type, filePath, cb ) {
  if ( typeof cb === "function" && typeof type === "string" && typeof filePath === "string" ) {
    extractWithType( type, filePath, cb );
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

      callback = null;
      if ( typeof cb === "function" ) {
        callback = cb;
      } else {
        if ( typeof filePath === "function" ) {
          callback = filePath;
        } else {
          if ( typeof type === "function" ) {
            callback = type;
          }
        }
      }

      if (callback) {
        callback( new Error("Incorrect parameters passed to textract."), null );
      } else {
        console.error( 'textract could not find a callback to execute.' );
      }
    }
  }

}

module.exports = textract;