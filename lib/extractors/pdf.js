var path = require( 'path' )
  , exec = require( 'child_process' ).exec
  , extract = require( 'pdf-extract' )
  , extend = require( 'extend' )
  ;

function extractText( filePath, options, cb ) {
  // See https://github.com/dbashford/textract/issues/75 for description of
  // what is happening here
  var pdfExtractOptions = {
    type: 'text',
    layout: false,
    ocr_flags: ['-psm 1'] // For OCR extraction to autodetect page orientation
  };

  // Apply user provided config to defaults
  extend(true, pdfExtractOptions, options.pdf);

  if (pdfExtractOptions.type === 'ocr') {
    var processor = extract(filePath, pdfExtractOptions, function(err) {
      if (err) {
        return cb(err);
      }
    });
    processor.on('complete', function(data) {
      cb(null, data.text_pages.join( ' ' ).trim());
    });
    processor.on('error', function(err) {
      error = new Error( "Error performing OCR text extraction for file at [[ " + path.basename( filePath ) + " ]], error: " + err.message );
      return cb(err, null);
    });
  } else {
    var fullText;
    var originalMethod = pdfExtractOptions.type;
    pdfExtractOptions.type = 'text';

    var textProcessor = extract( filePath, pdfExtractOptions, function( error ) {
      if (error) {
        return cb( error, null );
      }
    });

    textProcessor.on('error', function( error ) {
      error = new Error( "Error extracting PDF text for file at [[ " + path.basename( filePath ) + " ]], error: " + error.message );
      return cb( error, null );
    });

    textProcessor.on('complete', function(data) {
      fullText = data.text_pages.join(' ').trim();
      if (originalMethod === 'text' || (originalMethod === 'fallback' && fullText.length > 0)) {
        return cb(null, fullText);
      } else {
        pdfExtractOptions.type = 'ocr';
        var ocrProcessor = extract(filePath, pdfExtractOptions, function ( error ) {
          if (error) {
            return cb( error, null );
          }
        });

        ocrProcessor.on('error', function (error) {
          error = new Error("Error performing OCR text extraction for file at [[ " + path.basename(filePath) + " ]], error: " + error.message);
          return cb(error, null);
        });

        ocrProcessor.on('complete', function (data) {
          fullText += ' ' + data.text_pages.join(' ');
          return cb(null, fullText.trim());
        });
      }
    });
  }
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
