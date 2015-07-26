var exec = require('child_process').exec
  , path = require('path')
  , xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , util = require('../util')
  ;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null;

  filePath = util.scrubPathName(filePath);
  var execOptions = util.createExecOptions("docx", options);

  var cmd = "unzip -p " + filePath + " \"*.xml\" -x word/media/* word/_rels/* ";
  exec( cmd,
    execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "extract docx unzip exec error " + path.basename( filePath ) + ": " + error.message );
        cb( error, null );
        return;
      }

      var doc = new dom().parseFromString( stdout );
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

      text = util.replaceTextChars(text);

      cb( null, text );
    }
  );
};

var testForBinary = function( cb ) {
  util.unzipCheck("DOCXs", cb);
};

module.exports = {
  types: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  extract: extractText,
  test: testForBinary
};
