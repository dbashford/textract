var path = require( 'path' )
  , exec = require( 'child_process' ).exec
  , extract = require( 'pdf-text-extract' )
  ;

function extractText( filePath, options, cb ) {
  // See https://github.com/dbashford/textract/issues/75 for description of
  // what is happening here
  var pdftotextOptions = options.pdftotextOptions || { layout: 'raw' };

  extract( filePath, pdftotextOptions, function( error, pages ) {
    var fullText;
    if ( error ) {
      error = new Error( 'Error extracting PDF text for file at [[ ' +
        path.basename( filePath ) + ' ]], error: ' + error.message );
      cb( error, null );
      return;
    }
    fullText = pages.join( ' ' ).trim();
    cb( null, fullText );
  });
}

function testForBinary( options, cb ) {
  exec( 'pdftotext -v',
    function( error, stdout, stderr ) {
      var msg;
      if ( stderr && stderr.indexOf( 'pdftotext version' ) > -1 ) {
        cb( true );
      } else {
        msg = 'INFO: \'pdftotext\' does not appear to be installed, ' +
         'so textract will be unable to extract PDFs.';
        cb( false, msg );
      }
    }
  );
}

module.exports = {
  types: ['application/pdf'],
  extract: extractText,
  test: testForBinary
};
