var fs = require( 'fs' )
  , path = require( 'path' )
  , extractorPath = path.join( __dirname, "extractors" )
  , typeExtractors = {}
  , regexExtractors = []
  , preserveLineBreaks = /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~\n\r]*/g
  , stripLineBreaks = /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g

var registerExtractor = function( extractor ) {
  extractor.types.forEach( function( type ) {
    if ( typeof type === "string" ) {
      typeExtractors[type] = extractor.extract;
    } else {
      if ( type instanceof RegExp ) {
        regexExtractors.push( { reg: type, extractor: extractor.extract} )
      }
    }
  });
};

var testExtractor = function( extractor ) {
  extractor.test( function( passedTest ) {
    if ( passedTest ) {
      registerExtractor( extractor );
    }
  });
}

// global, all file type, content cleansing
var cleanseText = function( options, cb ) {
  return function( error, text ) {
    if ( !error ) {
      // clean up text
      if ( options.preserveLineBreaks ) {
        text = text.replace(preserveLineBreaks, ' ');
      } else {
        text = text.replace(stripLineBreaks, ' ');
      }
      text = text.replace(/ (?! )/g, '');
      text = text.replace(/\s{2,}/g, ' ');
    }
    cb( error, text );
  }
};

var extract = function( type, filePath, options, cb ) {
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
};

fs.readdirSync( extractorPath ).forEach( function( item ) {
  var fullPath = path.join( extractorPath, item )
  var extractor = require( fullPath );
  if ( extractor.test ) {
    testExtractor( extractor )
  } else {
    registerExtractor( extractor );
  }
});

module.exports = extract;