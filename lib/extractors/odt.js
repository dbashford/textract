var cheerio = require( 'cheerio' )
  , yauzl = require( 'yauzl' )
  , util = require( '../util' )
  ;

function extractText( filePath, options, cb ) {
  
  yauzl.open( filePath, function( err, zipfile ) {
    var textOnTheWay = false;
    var outputContent;
    var outputStyles;
    var headerTexts = [];
    var nodeTexts = [];
    var footerTexts = [];

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
      var $, nodes, header, footer, i;

      if ( entry.fileName === 'content.xml' || entry.fileName === 'styles.xml') {

        textOnTheWay = true;
        
        util.getTextFromZipFile( zipfile, entry, function( err2, text ) {

          if (entry.fileName == 'content.xml') {

            outputContent = text
              .replace( /^(.Archive).*/, '' )
              .replace( 'inflating: content.xml', '' )
              .replace( /text:p/g, 'textractTextNode' )
              .replace( /text:h/g, 'textractTextNode' )
              // remove empty nodes
              .replace( /<textractTextNode\/>/g, '' )
              // remove empty nodes that have styles
              .replace( /<textractTextNode[^>]*\/>/g, '' )
              .trim()

              $ = cheerio.load( '<body>' + outputContent + '</body>' );
              nodes = $( 'textractTextNode' );
  
              for ( i = 0; i < nodes.length; i++ ) {
                nodeTexts.push( $( nodes[i] ).text() );
              }

              if (!options.allowHeaderAndFooter) {
                cb( null, nodeTexts.join( '\n' ) );
              }

          } else  if (entry.fileName == 'styles.xml') {

            outputStyles = text
              .replace( /^(.Archive).*/, '' )
              .replace( 'inflating: style.xml', '' )
              .replace (/style:header/g, 'textractHeader')
              .replace (/style:footer/g, 'textractFooter')
              .replace( /<textractHeader\/>/g, '' )
              .replace( /<textractFooter\/>/g, '' )
              .replace( /<textractHeader[^>]*\/>/g, '' )
              .replace( /<textractFooter[^>]*\/>/g, '' )
              .trim()

              $ = cheerio.load( '<body>' + outputStyles + '</body>' )
              header = $( 'textractHeader' )
              footer = $( 'textractFooter' )
  
              for ( i = 0; i < header.length; i++ ) {
                headerTexts.push( $( header[i] ).text() );
              }
              for ( i = 0; i < footer.length; i++ ) {
                footerTexts.push( $( footer[i] ).text() );
              }
          }

          if (outputContent && outputStyles && options.allowHeaderAndFooter) {

            var divider = '\n'
            var t = headerTexts.join( divider );
            t += divider + nodeTexts.join(divider );
            t += footerTexts.join( divider );
            cb( null, t);

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
