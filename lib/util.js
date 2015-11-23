var exec = require('child_process').exec;

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
  getTextFromZipFile: getTextFromZipFile,
  yauzlError: yauzlError
};