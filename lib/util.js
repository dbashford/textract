var exec = require('child_process').exec;

var SINGLE_QUOTES = /[\u2018|\u2019]/g
  , DOUBLE_QUOTES = /[\u201C|\u201D]/g
  , MULTI_SPACES = /\s{2,}/g
  , NON_ASCII_CHARS = /[^\x00-\x7F\x80-\xFF]/g
  ;

var scrubPathName = function(filePath) {
  filePath = filePath.replace( /\(/g, '\\(' );
  filePath = filePath.replace( /\)/g, '\\)' );
  filePath = filePath.replace( / /g, '\\ ' );
  return filePath;
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

module.exports = {
  scrubPathName: scrubPathName,
  createExecOptions: createExecOptions,
  unzipCheck: unzipCheck,
  replaceTextChars: replaceTextChars
}