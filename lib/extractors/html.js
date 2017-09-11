/* eslint-disable max-len */

var cheerio = require( 'cheerio' )
  , fs = require( 'fs' )
  ;

function extractFromText( data, cb ) {
  var $, text;

  text = data.toString()
    .replace( /< *(br|p|div|section|aside|button|header|footer|li|article|blockquote|cite|code|h1|h2|h3|h4|h5|h6|legend|nav)((.*?)>)/g, '<$1$2|||||' )
    .replace( /< *\/(td|a|option) *>/g, ' </$1>' ) // spacing some things out so text doesn't get smashed together
    .replace( /< *(a|td|option)/g, ' <$1' ) // spacing out links
    .replace( /< *(br|hr) +\/>/g, '|||||<$1\\>' )
    .replace( /<\/ +?(p|div|section|aside|button|header|footer|li|article|blockquote|cite|code|h1|h2|h3|h4|h5|h6|legend|nav)>/g, '|||||</$1>' );

  text = '<textractwrapper>' + text + '<textractwrapper>';

  try {
    $ = cheerio.load( text );
    $( 'script' ).remove();
    $( 'style' ).remove();
    $( 'noscript' ).remove();

    text = $( 'textractwrapper' ).text().replace( /\|\|\|\|\|/g, '\n' )
      .replace( /(\n\u00A0|\u00A0\n|\n | \n)+/g, '\n' )
      .replace( /(\r\u00A0|\u00A0\r|\r | \r)+/g, '\n' )
      .replace( /(\v\u00A0|\u00A0\v|\v | \v)+/g, '\n' )
      .replace( /(\t\u00A0|\u00A0\t|\t | \t)+/g, '\n' )
      .replace( /[\n\r\t\v]+/g, '\n' )
      ;
  } catch ( err ) {
    cb( err, null );
    return;
  }

  cb( null, text );
}

function extractText( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if ( error ) {
      cb( error, null );
      return;
    }
    extractFromText( data, cb );
  });
}

module.exports = {
  types: [
    'text/html',
    'text/xml',
    'application/xml',
    'application/rss+xml',
    'application/atom+xml'
  ],
  extract: extractText,
  extractFromText: extractFromText
};
