var exec = require( 'child_process' ).exec
  , util = require( '../util' )
  ;

var generateCommand = function( options, inputFile, outputFile ) {
  var cmd = "tesseract " + inputFile + " " + outputFile;
  if ( options.tesseract && options.tesseract.lang ) {
    cmd += " -l " + options.tesseract.lang;
  }
  cmd += " quiet";
  return cmd;
};

var extractText = function( filePath, options, cb ) {
  var execOptions = util.createExecOptions( "images", options );
  util.runExecIntoFile( "tesseract", filePath, options, execOptions, generateCommand, cb );
};

var testForBinary = function( options, cb ) {
  exec('tesseract',
    function (error, stdout, stderr) {
      if (error && error.toString().indexOf("tesseract") > -1 || stderr && stderr.toString().indexOf("tesseract") > -1) {
        cb( true );
      } else {
        var msg = "INFO: 'tesseract' does not appear to be installed, so textract will be unable to extract images.";
        cb( false, msg );
      }
    }
  );
};

module.exports = {
  types: ["image/png", "image/jpeg", "image/gif"],
  extract: extractText,
  test: testForBinary
};