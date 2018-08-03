var cheerio = require( 'cheerio' )
  , yauzl = require( 'yauzl' )
  , util = require( '../util' )
  ;

function extractText( filePath, options, cb ) {
  yauzl.open( filePath, function( err, zipfile ) {
    var textOnTheWay = false;

    if ( err ) {
      util.yauzlError( err, cb );
      return;
    }

    zipfile.on( 'end', function() {
      if ( !textOnTheWay ) {
        cb(
          new Error( 'Extraction could not find content.xml in file, ' +
            'are you sure it is the mime type it says it is?' ),
          null );
      }
    });

    zipfile.on( 'entry', function( entry ) {
      if ( entry.fileName === 'content.xml' ) {
        textOnTheWay = true;
        util.getTextFromZipFile( zipfile, entry, function( err2, text ) {
          var output = text
              .replace( 'inflating: content.xml', '' )
              .replace( /^(.Archive).*/, '' )
              .replace( /text:p/g, 'textractTextNode' )
              .replace( /text:h/g, 'textractTextNode' )
              // remove empty nodes
              .replace( /<textractTextNode\/>/g, '' )
              // remove empty nodes that have styles
              .replace( /<textractTextNode[^>]*\/>/g, '' )
              .trim()
            , $ = cheerio.load( '<body>' + output + '</body>' )
            , nodes = $( 'textractTextNode' )
            , nodeTexts = []
            , i
            ;

          for ( i = 0; i < nodes.length; i++ ) {
            nodeTexts.push( $( nodes[i] ).text() );
          }

          cb( null, nodeTexts.join( '\n' ) );
        });
      }
    });

    zipfile.on( 'error', function( err3 ) {
      cb( err3 );
    });
  });
}

module.exports = {
  types: [
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.text-template',
    'application/vnd.oasis.opendocument.graphics',
    'application/vnd.oasis.opendocument.graphics-template',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.presentation-template'
  ],
  extract: extractText
};
