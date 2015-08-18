var exec = require('child_process').exec;

var SINGLE_QUOTES = /[\u2018|\u2019]/g
  , DOUBLE_QUOTES = /[\u201C|\u201D]/g
  , MULTI_SPACES = /[^\S\r\n]{2,}/g
  , NON_ASCII_CHARS = /[^\x00-\x7F\x80-\xFF]/g
  ;

var yauzlError = function( err, cb ) {
  var msg = err.message;
  if ( msg === "end of central directory record signature not found" ) {
    msg = "File not correctly recognized as zip file, " + msg;
  }
  cb( new Error(msg) , null );
};

var createExecOptions = function(type, options) {
  var execOptions = {};
  if (options[type] && options[type].exec) {
    execOptions = options[type].exec;
  } else {
    if (options.exec) {
      execOptions = options.exec;
    }
  }
  return execOptions;
};

var unzipCheck = function(type, cb) {
  exec( "unzip",
    function( error, stdout, stderr ) {
      if ( error ) {
        console.error( "textract: 'unzip' does not appear to be installed, so textract will be unable to extract " + type + "." );
      }
      cb( error === null );
    }
  );
};

var replaceTextChars = function(text) {
  return text.trim()
    .replace( SINGLE_QUOTES, "'" )
    .replace( DOUBLE_QUOTES, '"' )
    .replace( NON_ASCII_CHARS, '' )
    .replace( MULTI_SPACES, ' ' );
};

var getTextFromZipFile = function( zipfile, entry, cb ) {
  zipfile.openReadStream( entry, function( err, readStream ) {
    if ( err ) {
      cb( err, null );
      return;
    }

    var text = ""
      , error = ""
      ;

    readStream.on( 'data', function( chunk ) {
      text += chunk;
    });
    readStream.on( 'end', function() {
      if ( error.length > 0) {
        cb( error, null );
      } else {
        cb( null, text );
      }
    });
    readStream.on( 'error', function( _err ) {
      error += _err;
    });
  });
};

module.exports = {
  createExecOptions: createExecOptions,
  unzipCheck: unzipCheck,
  replaceTextChars: replaceTextChars,
  getTextFromZipFile: getTextFromZipFile,
  yauzlError: yauzlError
};