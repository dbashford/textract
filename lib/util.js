var exec = require('child_process').exec;

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

module.exports = {
  scrubPathName: scrubPathName,
  createExecOptions: createExecOptions,
  unzipCheck: unzipCheck
}