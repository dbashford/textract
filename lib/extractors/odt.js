"use strict";

var exec = require('child_process').exec
  , cheerio = require('cheerio')
  , util = require('../util')
  ;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null;

  filePath = util.scrubPathName(filePath);
  var execOptions = util.createExecOptions("odt", options);

  exec( "unzip -c " + filePath + " content.xml",
    execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "extract odt exec error: " + error );
        cb( error, null );
        return;
      }

      var output = stdout
        .replace("inflating: content.xml", '')
        .replace(/^(.Archive).*/)
        .replace(/text:p/g, "textractTextNode")
        .replace(/text:h/g, "textractTextNode")
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
    }
  );
};

var testForBinary = function( cb ) {
  util.unzipCheck("ODTs", cb);
};

module.exports = {
  types: [
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.text-template"
  ],
  extract: extractText,
  test: testForBinary
};
