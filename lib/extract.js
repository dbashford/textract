var fs = require( 'fs' )
  , path = require( 'path' )
  , extractorPath = path.join( __dirname, "extractors" )
  , typeExtractors = {}
  , regexExtractors = [];

fs.readdirSync( extractorPath ).map( function( item ) {
  var fullPath = path.join( extractorPath, item )
  return require( fullPath );
}).forEach( function( extractor ) {
  extractor.types.forEach( function( type ) {
    if ( typeof type === "string" ) {
      typeExtractors[type] = extractor.extract;
    } else {
      if ( type instanceof RegExp ) {
        regexExtractors.push( { reg: type, extractor: extractor.extract} )
      }
    }
  });
});

// global, all file type, content cleansing
var cleanseText = function( cb ) {
  return function( error, text ) {
    if ( !error ) {
      // clean up text
      text = text.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    }
    cb( error, text );
  }
};

var extract = function( type, filePath, cb ) {
  var theExtractor = null;
  if ( typeExtractors[type] ) {
    theExtractor = typeExtractors[type];
  } else {
    regexExtractors.forEach( function (extractor) {
      if ( type.match( extractor.reg ) ) {
        theExtractor = extractor.extractor;
      }
    });
  }

  if (theExtractor) {
    cb = cleanseText( cb );
    theExtractor( filePath, cb );
  } else {
    var error = new Error( "textract does not currently extract files of type [[ " + type + " ]]" );
    error.typeNotFound = true;
    cb( error , null );
  }
};

module.exports = extract;