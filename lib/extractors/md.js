var cheerio = require('cheerio')
  , fs = require('fs')
  , marked = require("marked")
  , htmlExtract = require("./html")
  ;

var extractText = function( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if ( error ) {
      console.log("CALLING THIS CALLBACK NOW")
      cb( error, null );
      return;
    }

    marked( data.toString(), function( err, content ) {
      if ( err ) {
        console.log("CALLING THIS CALLBACK")
        cb( err, null);
      } else {
        htmlExtract.extractFromText( content, cb );
      }
    });
  });
};

module.exports = {
  types: ["text/x-markdown"],
  extract: extractText
};