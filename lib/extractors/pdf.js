var path = require("path")
  , exec = require('child_process').exec
  , extract = require( 'pdf-text-extract' )
  ;

var extractText = function( filePath, options, cb ) {

  // See https://github.com/dbashford/textract/issues/75 for description of
  // what is happening here
  var pdftotextOptions = options.pdftotextOptions || { layout : "raw" };

  extract( filePath, pdftotextOptions, function ( error, pages ) {
    if ( error ) {
      error = new Error( "Error extracting PDF text for file at [[ " + path.basename( filePath ) + " ]], error: " + error.message );
      cb( error, null );
      return;
    }
    var fullText = pages.join( ' ' ).trim();
    cb( null, fullText );
  });
};

var testForBinary = function( options, cb ) {
  exec( "pdftotext -v",
    function( error, stdout, stderr ) {
      if (stderr && stderr.indexOf("pdftotext version") > -1) {
        cb( true );
      } else {
        cb( false );
      }
    }
  );
};

module.exports = {
  types: ["application/pdf"],
  extract: extractText,
  test: testForBinary
};
