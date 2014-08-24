var extract = require( 'pdf-text-extract' )
  , exec = require('child_process').exec;

var extractText = function( filePath, options, cb ) {
  extract( filePath , function ( error, pages ) {
    if ( error ) {
      error = new Error( "Error extracting PDF text for file at [[ " + filePath + " ]], error: " + error );
      cb( error, null );
      return;
    }
    var fullText = pages.join( ' ' ).trim();
    cb( null, fullText );
  });
};

var testForBinary = function( cb ) {
  exec( "pdftotext -v",
    function( error, stdout, stderr ) {
      if (stderr && stderr.indexOf("pdftotext version") > -1) {
        cb( true );
      } else {
        console.error( "textract: 'pdftotext' does not appear to be installed, so it will be unable to extract PDFs. http://www.foolabs.com/xpdf/" );
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
