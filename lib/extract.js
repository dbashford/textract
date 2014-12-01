var fs = require( 'fs' )
  , path = require( 'path' )
  , extractorPath = path.join( __dirname, "extractors" )
  , extensionExtractors = {}
  , typeExtractors = {}
  , regexExtractors = []
  , WHITELIST_PRESERVE_LINEBREAKS = /[^A-Za-z\x80-\xFF 0-9 \u2018\u2019\u2026 \u00C0-\u1FFF \u2C00-\uD7FF \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w\n\r]*/g
  , WHITELIST_STRIP_LINEBREAKS = /[^A-Za-z\x80-\xFF 0-9 \u2018\u2019\u2026 \u00C0-\u1FFF \u2C00-\uD7FF \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w]*/g
  , SINGLE_QUOTES = /[\u2018|\u2019]/g
  , DOUBLE_QUOTES = /[\u201C|\u201D]/g
  , MULTIPLE_SPACES = /[ \t\v\u00A0]{2,}/g // multiple spaces, tabs, vertical tabs, non-breaking space
  , extractors = []
  , totalExtractors = 0
  , satisfiedExtractors = 0;

var registerExtractor = function( extractor ) {
  if ( extractor.types ) {
    extractor.types.forEach( function( type ) {
      if ( typeof type === "string" ) {
        typeExtractors[type] = extractor.extract;
      } else {
        if ( type instanceof RegExp ) {
          regexExtractors.push( { reg: type, extractor: extractor.extract} );
        }
      }
    });
  }

  if ( extractor.extensions ) {
    extractor.extensions.forEach( function( ext ) {
      extensionExtractors[ext] = extractor.extract;
    });
  }
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
        text = text.replace( WHITELIST_PRESERVE_LINEBREAKS, ' ' );
      } else {
        text = text.replace( WHITELIST_STRIP_LINEBREAKS, ' ' );
      }

      text = text.replace( / (?! )/g, '' )
        .replace( MULTIPLE_SPACES, ' ' )  // replace 2 or more spaces with 1 space
        .replace( SINGLE_QUOTES, "'" ) // replace nasty quotes with simple ones
        .replace( DOUBLE_QUOTES, '"' ); // replace nasty quotes with simple ones

    }
    cb( error, text );
  };
};

var extract = function( type, filePath, options, cb ) {
  if ( totalExtractors === satisfiedExtractors ) {
    var theExtractor;
    var extension = path.extname( filePath ).substring( 1 );
    if ( extensionExtractors[extension] ) {
      theExtractor = extensionExtractors[extension];
    } else if ( typeExtractors[type] ) {
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
    console.error( "textract not ready, retrying in .5 seconds" );
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
