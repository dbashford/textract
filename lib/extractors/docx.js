var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , yauzl = require('yauzl')
  , util = require('../util')
  , includeRegex = /.xml$/
  , excludeRegex = /^(word\/media\/|word\/_rels\/)/
  ;

var _calculateExtractedText = function( inText ) {
  var doc = new dom().parseFromString( inText );
  var ps = xpath.select( "//*[local-name()='p']", doc );
  var text = "";

  ps.forEach( function ( paragraph ) {
    paragraph = new dom().parseFromString( paragraph.toString() );
    var ts = xpath.select( "//*[local-name()='t' or local-name()='tab' or local-name()='br']", paragraph );
    var localText = "";
    ts.forEach( function ( t ) {
      if ( t.localName === "t" && t.childNodes.length > 0 ) {
        localText += t.childNodes[0].data;
      } else {
        if ( t.localName === "tab" || t.localName === "br" ) {
          localText += " ";
        }
      }
    });
    text += localText + "\n";
  });

  return util.replaceTextChars( text );
};

var extractText = function( filePath, options, cb ) {
  var result = '';

  yauzl.open( filePath, function( err, zipfile ) {
    if ( err ) {
      util.yauzlError( err, cb );
      return;
    }

    var processedEntries = 0;
    var processEnd = function() {
      if( zipfile.entryCount === ++processedEntries ) {
        if ( result.length ) {
          var text = _calculateExtractedText( result );
          cb( null, text );
        } else {
          cb(
            new Error("Extraction could not find content in file, are you sure it is the mime type it says it is?"),
            null);
        }
      }
    }

    zipfile.on( "entry", function( entry ) {
      if ( includeRegex.test( entry.fileName ) && !excludeRegex.test( entry.fileName ) )  {
        util.getTextFromZipFile( zipfile, entry, function( err, text ) {
          result += text + "\n";
          processEnd();
        });
      } else {
        processEnd();
      }
    });
  });
};

module.exports = {
  types: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  extract: extractText
};
