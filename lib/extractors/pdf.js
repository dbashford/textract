var extract = require( 'pdf-text-extract' );

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

module.exports = {
  types: ["application/pdf"],
  extract: extractText
}