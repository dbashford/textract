var extract = require( 'pdf-text-extract' )
  , exec = require('child_process').exec;


var extractText = function( filePath, cb ) {
    extract( filePath , function ( error, pages ) {
    if ( error ) {
      error = new Error( "Error extracting PDF text for file at [[ " + filePath + " ]], error: " + error );
      cb( error, null );
      return;
    }
    var fullText = pages.join( ' ' ).trim();
    cb( null, fullText )
  });
}

var testForBinary = function() {
  exec( "pdftotext -v", function( error, stdout, stderr ) {
    if (stderr && stderr.indexOf("pdftotext version") > -1) {
      // pdftotext exists
    } else {
      console.error( "textract: 'pdftotext' does not appear to be installed, so it will be unable to extract PDFs. http://www.foolabs.com/xpdf/" );
    }
  });
}

module.exports = {
  types: ["application/pdf"],
  extract: extractText,
  test: testForBinary
}