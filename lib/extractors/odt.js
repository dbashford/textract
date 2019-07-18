var cheerio = require( 'cheerio' )
  , yauzl = require( 'yauzl' )
  , util = require( '../util' )
  ;

function extractText( filePath, options, cb ) {
  
  yauzl.open( filePath, function( err, zipfile ) {
    var textOnTheWay = false;
    var output;
    var headerTexts = []
    var nodeTexts = [];
    var footerTexts = []
    var numFilesRead = 0;

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

      if ( entry.fileName === 'content.xml' || entry.fileName === 'styles.xml') {

        numFilesRead++;
        textOnTheWay = true;

        util.getTextFromZipFile( zipfile, entry, function( err2, text ) {

          output = text.replace( /^(.Archive).*/, '' );

        if (entry.fileName == 'content.xml') {

            output += output
            .replace( 'inflating: content.xml', '' )
            .replace( /text:p/g, 'textractTextNode' )
            .replace( /text:h/g, 'textractTextNode' )

        } else  if (entry.fileName == 'styles.xml') {

          output += output
          .replace( 'inflating: style.xml', '' )
          .replace (/style:header/g, 'textractHeader')
          .replace (/style:footer/g, 'textractFooter')

        }

        if (numFilesRead === 2) {

          output += output
          // remove empty nodes
          .replace( /<textractTextNode\/>/g, '' )
          .replace( /<textractHeader\/>/g, '' )
          .replace( /<textractFooter\/>/g, '' )
          // remove empty nodes that have styles
          .replace( /<textractTextNode[^>]*\/>/g, '' )
          .replace( /<textractHeader[^>]*\/>/g, '' )
          .replace( /<textractFooter[^>]*\/>/g, '' )
          .trim()
        
        
          var $ = cheerio.load( '<body>' + output + '</body>' )
          , nodes = $( 'textractTextNode' )
          , header = $( 'textractHeader' )
          , footer = $( 'textractFooter' )
          , i
          ;

          for ( i = 0; i < nodes.length; i++ ) {
            nodeTexts.push( $( nodes[i] ).text() );
          }
          for ( i = 0; i < header.length; i++ ) {
            headerTexts.push( $( header[i] ).text() );
          }
          for ( i = 0; i < footer.length; i++ ) {
            footerTexts.push( $( footer[i] ).text() );
          }

          var divider = '\n'
          var t = headerTexts.join( divider )
          t += nodeTexts.join( divider )
          t += footerTexts.join( divider )
          cb( null, t );
        }
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
