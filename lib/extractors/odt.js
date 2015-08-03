var exec = require('child_process').exec
  , path = require("path")
  , cheerio = require('cheerio')
  , yauzl = require('yauzl')
  , util = require('../util')
  ;

var extractText = function( filePath, options, cb ) {

  yauzl.open( filePath, function( err, zipfile ) {
    if ( err ) {
      util.yauzlError( err, cb );
      return;
    }

    var textOnTheWay = false;

    zipfile.on( "end", function() {
      if ( !textOnTheWay ) {
        cb(
          new Error("Extraction could not find content.xml in file, are you sure it is the mime type it says it is?"),
          null);
      }
    });

    zipfile.on( "entry", function( entry) {
      if ( entry.fileName === "content.xml" ) {
        textOnTheWay = true;
        util.getTextFromZipFile( zipfile, entry, function( err, text ) {
          var output = text
            .replace( "inflating: content.xml", '' )
            .replace( /^(.Archive).*/, '' )
            .replace( /text:p/g, "textractTextNode" )
            .replace( /text:h/g, "textractTextNode" )
            .replace( /<textractTextNode\/>/g, '' )
            .trim();

          var $ = cheerio.load( "<body>" + output + "</body>" );
          var nodes = $('textractTextNode');
          var nodeTexts = [];
          for (var i = 0; i < nodes.length; i++) {
            nodeTexts.push($(nodes[i]).text());
          }
          var contentWithBreaks = nodeTexts.join("\n");
          contentWithBreaks = util.replaceTextChars(contentWithBreaks);

          cb( null, contentWithBreaks );
        });
      }
    });
  });
};

module.exports = {
  types: [
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.text-template",
    "application/vnd.oasis.opendocument.graphics",
    "application/vnd.oasis.opendocument.graphics-template",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.presentation-template"
  ],
  extract: extractText
};
