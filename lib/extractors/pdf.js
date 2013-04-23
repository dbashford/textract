var extract = require( 'pdf-text-extract' );

var extractText = function( filePath, cb ) {
    extract( filePath , function ( err, pages ) {
    if ( err ) {
      cb( "Error extracting PDF text for file at [[ " + filePath + " ]], error: " + err, null );
      return;
    }
    var fullText = pages.join( ' ' )
    cb( null, fullText )
  });
}

module.exports = {
  types: ["application/pdf"],
  extract: extractText
}