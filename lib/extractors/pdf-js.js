var path = require( 'path' )
   , pdfjs = require( 'pdfjs-dist' );

function _createError( filePath, e ) {
  return new Error( 'Error extracting PDF text for file at [[ ' +
    path.basename( filePath ) + ' ]], error: ' + e.message );
}

function _getTextFromPage( page, preserveLineBreaks ) {
  return page.getTextContent().then( ( textContent ) => {
    var text = ''
      , lastY = -1;

    textContent.items.forEach( ( item ) => {
      var itemStr = item.str
        , itemY = item.transform[5];

      if ( itemStr === '' ) return;

      if ( preserveLineBreaks && lastY !== itemY ) {
        text = text.trim();
        text += '\n';
      }

      text += itemStr;
      lastY = itemY;
    });

    return text.trim();
  });
}

function _isArrayBuffer( v ) {
  return typeof v === 'object' && v !== null && v.byteLength !== undefined;
}

function _createOptions( filePath, baseOptions ) {
  var pdftotextOptions = baseOptions.pdftotextOptions || {}
    , options = {
      password: pdftotextOptions.userPassword,
    };

  if ( _isArrayBuffer( filePath ) ) {
    options.data = filePath;
  } else {
    options.url = filePath;
  }

  return options;
}

function extractText( filePath, baseOptions, cb ) {
  var options = baseOptions || {}
    , pdfJsOptions = _createOptions( filePath, options )
    , preserveLineBreaks = options.preserveLineBreaks;

  pdfjs.getDocument( pdfJsOptions ).then( ( pdf ) => {
    var pagePromises = []
      , pageNumber;

    for ( pageNumber = 1; pageNumber <= pdf.numPages; ++pageNumber ) {
      pagePromises.push( pdf.getPage( pageNumber ) );
    }

    return Promise.all( pagePromises );
  })
  .then( ( pages ) => Promise.all( pages.map( ( page ) =>
    _getTextFromPage( page, preserveLineBreaks )
  ) ) )
  .then( ( textFromPages ) => {
    cb( null, textFromPages.join( '\n' ) );
  })
  .catch( ( e ) => {
    cb( _createError( filePath, e ), null );
  });
}

module.exports = {
  types: ['application/pdf'],
  extract: extractText
};
