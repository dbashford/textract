var fs = require( 'fs' )
  , path = require( 'path' )
  , extractorPath = path.join( __dirname, "extractors" )
  , typeExtractors = {}
  , regexExtractors = []
  , preserveLineBreaks = /[^A-Za-z\x80-\xFF 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'\n\r]*/g
  , stripLineBreaks = /[^A-Za-z\x80-\xFF 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~']*/g
  , extractors = []
  , totalExtractors = 0
  , satisfiedExtractors = 0;

var registerExtractor = function( extractor ) {
  extractor.types.forEach( function( type ) {
    if ( typeof type === "string" ) {
      typeExtractors[type] = extractor.extract;
    } else {
      if ( type instanceof RegExp ) {
        regexExtractors.push( { reg: type, extractor: extractor.extract} );
      }
    }
  });
};

var testExtractor = function( extractor ) {
  extractor.test( function( passedTest ) {
    satisfiedExtractors++;
    if ( passedTest ) {
      registerExtractor( extractor );
    }
  });
};

// global, all file type, content cleansing
var cleanseText = function( options, cb ) {
  return function( error, text ) {
    if ( !error ) {
      // clean up text
      if ( options.preserveLineBreaks ) {
        text = text.replace( preserveLineBreaks, ' ' );
      } else {
        text = text.replace( stripLineBreaks, ' ' );
      }
      text = text.replace( / (?! )/g, '' );
      text = text.replace( /\s{2,}/g, ' ' );
    }
    cb( error, text );
  };
};

var extract = function( type, filePath, options, cb ) {
  if ( totalExtractors === satisfiedExtractors ) {
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
      cb = cleanseText( options, cb );
      theExtractor( filePath, options, cb );
    } else {
      var error = new Error( "textract does not currently extract files of type [[ " + type + " ]]" );
      error.typeNotFound = true;
      cb( error , null );
    }
  } else {
    console.log( "textract not ready, retrying in .5 seconds" );
    setTimeout(function(){
      extract( type, filePath, options, cb );
    }, 500);
  }
};

extractors = fs.readdirSync( extractorPath ).filter( function( extractor ) {
  return extractor !== "temp";
});
totalExtractors = extractors.length;
extractors.map( function ( item ) {
  var fullExtractorPath = path.join( extractorPath, item );
  return require( fullExtractorPath );
}). forEach( function( extractor ) {
  if ( extractor.test ) {
    testExtractor( extractor );
  } else {
    satisfiedExtractors++;
    registerExtractor( extractor );
  }
});

module.exports = extract;
