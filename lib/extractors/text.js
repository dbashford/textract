var fs = require( 'fs' );

var iconv = require('iconv-lite');
var jschardet = require('jschardet');

var extractText = function( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    if ( error ) {
      cb( error, null );
      return;
    }
    var encoding = jschardet.detect(data).encoding.toLowerCase();
    var decoded = iconv.decode(data, encoding);
    cb( null, decoded );
  });
};

module.exports = {
  types: [/text\//, "application/csv", "application/javascript"],
  extract: extractText
};
