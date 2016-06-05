var spawn = require('child_process').spawn
  , exec = require('child_process').exec
  , os = require('os')
  , path = require('path')
  ;

var extractText = function( filePath, options, cb ) {

};

var testForBinary = function( options, cb ) {
  // just non-osx extractor
  if ( os.platform() === "darwin") {
    return cb( true );
  }

  exec('wvText ' + __filename,
    function (error, stdout, stderr) {
      if (error !== null && error.message && error.message.indexOf( "wvText: No such file or directory" ) == -1 ) {
        var msg = "INFO: 'wvText' does not appear to be installed, so textract will be unable to extract DOCs.";
        cb( false, msg );
      } else {
        cb( true );
      }
    }
  );
};

var types;
if ( os.platform() === "darwin") {
  types = [];
  types = ["application/msword"];
} else {
  types = ["application/msword"];
}

module.exports = {
  types: types,
  extract: extractText,
  test: testForBinary
};
