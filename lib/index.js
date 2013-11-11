var fs = require( 'fs' )
  , path = require( 'path' )
  , mime = require( 'mime' )
  , extract = require( './extract' );

var extractWithType = function( type, filePath, options, cb ) {
  fs.exists( filePath, function( exists ) {
    if ( exists ) {
      extract( type, filePath, options, cb );
    } else {
      cb( new Error( "File at path [[ " + filePath + " ]] does not exist." ), null );
    }
  });
};

var textract = function( type, filePath, options, cb ) {

  // Allow API to be slightly robust, do some type checking before invoking

  // textract(mimeType, filePath, options, callback)
  if ( typeof cb === "function" && typeof type === "string" && typeof filePath === "string" && typeof options === "object") {
    extractWithType( type, filePath, options, cb );
  } else {

    // textract(filePath, callback)
    if ( typeof filePath === "function" && typeof type === "string" ) {
      cb = filePath;
      filePath = type;
      type = mime.lookup( filePath );
      extractWithType( type, filePath, {}, cb );
    } else {

      // textract(mimeType, filePath, callback)
      if ( typeof options === "function" && typeof filePath === "string" && typeof type === "string") {
        cb = options;
        extractWithType( type, filePath, {}, cb );
      } else {

        // textract(filePath, options, callback)
        if ( typeof options === "function" && typeof filePath === "object" && typeof type === "string") {
          cb = options;
          options = filePath;
          filePath = type;
          type = mime.lookup( type );

          extractWithType( type, filePath, options, cb );

        } else {
          console.error( "Incorrect parameters passed to textract." );
          console.log( "Signatures:" );
          console.log( "  textract(filePath, callback)" );
          console.log( "  textract(mimeType, filePath, callback)" );
          console.log( "  textract(filePath, options, callback)" );
          console.log( "  textract(mimeType, filePath, options, callback)" );

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
  }

};

module.exports = textract;