var fs = require( 'fs' )
  , path = require( 'path' )
  , XmlEntities = require('html-entities').XmlEntities

  , extractorPath = path.join( __dirname, "extractors" )
  , entities = new XmlEntities()
  , typeExtractors = {}
  , regexExtractors = []
  , failedExtractorTypes = {}
  , totalExtractors = 0
  , satisfiedExtractors = 0
  , hasInitialized = false
  
  , WHITELIST_PRESERVE_LINEBREAKS = /[^A-Za-z\x80-\xFF 0-9 \u2018\u2019\u201C|\u201D\u2026 \u00C0-\u1FFF \u2C00-\uD7FF \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w\n\r]*/g
  , WHITELIST_STRIP_LINEBREAKS = /[^A-Za-z\x80-\xFF 0-9 \u2018\u2019\u201C|\u201D\u2026 \u00C0-\u1FFF \u2C00-\uD7FF \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w]*/g
  , SINGLE_QUOTES = /[\u2018|\u2019]/g
  , DOUBLE_QUOTES = /[\u201C|\u201D]/g
  , MULTIPLE_SPACES = /[ \t\v\u00A0]{2,}/g // multiple spaces, tabs, vertical tabs, non-breaking space
  ;

var registerExtractor = function( extractor ) {
  if ( extractor.types ) {
    extractor.types.forEach( function( type ) {
      if ( typeof type === "string" ) {
        typeExtractors[type] = extractor.extract;
      } else {
        if ( type instanceof RegExp ) {
          regexExtractors.push( { reg: type, extractor: extractor.extract } );
        }
      }
    });
  }
};

var registerFailedExtractor = function( extractor, failedMessage ) {
  if ( extractor.types ) {
    extractor.types.forEach( function( type ) {
      failedExtractorTypes[type] = failedMessage;
    });
  }
};

var testExtractor = function( extractor, options ) {
  extractor.test( options, function( passedTest, failedMessage ) {
    satisfiedExtractors++;
    if ( passedTest ) {
      registerExtractor( extractor );
    } else {
      registerFailedExtractor( extractor, failedMessage );
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

      text = entities.decode(text);

    }
    cb( error, text );
  };
};

var initializeExtractors = function(options) {
  hasInitialized = true;

  // discover available extractors
  var extractors = fs.readdirSync( extractorPath ).map( function ( item ) {
    var fullExtractorPath = path.join( extractorPath, item );
    // get the extractor
    return require( fullExtractorPath );
  });

  // perform any binary tests to ensure extractor is possible
  // given execution environment
  extractors.forEach( function( extractor ) {
    if ( extractor.test ) {
      testExtractor( extractor, options );
    } else {
      satisfiedExtractors++;
      registerExtractor( extractor );
    }
  });

  // need to keep track of how many extractors we have in total
  totalExtractors = extractors.length;
};

var findExtractor = function( type, filePath ) {
  if ( typeExtractors[type] ) {
    return typeExtractors[type];
  } else {
    for ( var i = 0, iLen = regexExtractors.length; i < iLen; i++ ) {
      var extractor = regexExtractors[i];
      if ( type.match( extractor.reg ) ) {
        return extractor.extractor;
      }
    }
  }
};

var extract = function( type, filePath, options, cb ) {

  if (!hasInitialized) {
    initializeExtractors(options);
  }

  // registration of extractors complete?
  if ( totalExtractors === satisfiedExtractors ) {
    var theExtractor = findExtractor( type, filePath );

    if (theExtractor) {
      cb = cleanseText( options, cb );
      theExtractor( filePath, options, cb );
    } else {
      // cannot extract this file type
      var msg = "Error for type: [[ " + type + " ]], file: [[ " + filePath + " ]]";

      // update error message if type is supported but just not configured/installed properly
      if (failedExtractorTypes[type]) {
        msg += ", extractor for type exists, but failed to initialize. Message: " + failedExtractorTypes[type];
      }

      var error = new Error( msg );
      error.typeNotFound = true;
      cb( error , null );
    }
  } else {
    // async registration has not wrapped up
    // try again later
    setTimeout(function(){
      extract( type, filePath, options, cb );
    }, 100);
  }
};

module.exports = extract;
