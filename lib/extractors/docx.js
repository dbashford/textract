var exec = require('child_process').exec;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null;

  filePath = filePath.replace( /\(/g, '\\(' )
  filePath = filePath.replace( /\)/g, '\\)' )
  filePath = filePath.replace( / /g, '\\ ' )

  exec( "unzip -c " + filePath + " | sed 's#</w:t># \\n\\n #g;s#</w:p># \\n\\n #g;s#<[^>]*>##g'",
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "extractNewWordDocument exec error: " + error );
        cb( error, null );
        return;
      }

      // This happens if docx isnt really docx
      if (stderr.length > 0 && stdout.trim() === "Archive:  " + filePath) {
        error = new Error( "No text found, error occurred: " + stderr )
        cb( error, null );
        return;
      }


      var zipPieces = [];

      // split on both extracting and inflating
      stdout.split( 'extracting:' ).forEach(function(piece){
        var pieces = piece.split( 'inflating:' );
        pieces.forEach( function( piece ) {
          if( piece.indexOf( "docProps/" ) !== 1)  {
            zipPieces.push( piece )
          }
        })
      })

      zipPieces = zipPieces.map( function( piece ) {
        var lines = piece.split( '\n' );

        // remove first line, is name of file
        lines.splice( 0, 1 );
        var text = lines.join( ' ' );

        // replace the new line place holders
        text = text.replace( / nn /g, ' ');

        // trim the empty space
        return text.trim();
      }).filter( function( item ) {
        // remove any pieces that are now empty
        return item.length > 0;
      }).filter( function( item ) {
        for ( var i = 0; i < item.length; i++ ) {
          var charCode = stdout.charCodeAt(i)
          // 8 and below are control characters (e.g. backspace, null, eof, etc.)
          //65533 is the unknown character
          if ( charCode <= 8 || charCode === 65533 ) {
            // remove any pieces that contain binary
            return false;
          }
        }
        return true;
      });

      var kosherContent = zipPieces.join( ' ' );

      cb( null, kosherContent );
    }
  );
}

var testForBinary = function( cb ) {
  exec( "unzip",
    function( error, stdout, stderr ) {
      if (error) {
        console.error( "textract: 'unzip' does not appear to be installed, so it will be unable to extract DOCXs." );
      }
      cb( error === null )
    }
  );
}

module.exports = {
  types: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  extract: extractText,
  test: testForBinary
}