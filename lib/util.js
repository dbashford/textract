var exec = require( 'child_process' ).exec
  , path = require( 'path' )
  , fs = require( 'fs' )
  , os = require( 'os' )
  , outDir = path.join( os.tmpdir(), "textract" )
  ;

// Up front creation of tmp dir
if ( !fs.existsSync( outDir ) ) {
  fs.mkdirSync( outDir );
}

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

/**
 * 1) builds an exec command using provided `genCommand` callback
 * 2) runs that command against an input file path
 *   resulting in an output file
 * 3) reads that output file in
 * 4) cleans the output file up
 * 5) executes a callback with the contents of the file
 *
 * @param {string} label Name for the extractor, e.g. `Tesseract`
 * @param {string} filePath path to file to be extractor
 * @param {object} options extractor options as provided
 *   via user configuration
 * @param {object} execOptions execution options passed to
 *   `exec` commmand as provided via user configuration
 * @param {function} genCommand function used to generate
 *   the command to be executed
 * @param {string} cb callback that is passed error/text
 *
 */
var runExecIntoFile = function( label, filePath, options, execOptions, genCommand, cb ) {
  // escape the file paths
  var fileTempOutPath = path.join( outDir, path.basename( filePath, path.extname( filePath ) ) );
  var escapedFilePath = filePath.replace( /\s/g, '\\ ' );
  var escapedFileTempOutPath = fileTempOutPath.replace( /\s/g, '\\ ' );
  var cmd = genCommand( options, escapedFilePath, escapedFileTempOutPath );

  exec( cmd, execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "Error extracting [[ " + path.basename( filePath )  + " ]], exec error: " + error.message );
        cb( error, null );
        return;
      }

      fs.exists( fileTempOutPath + ".txt", function( exists ) {
        if ( exists ) {
          fs.readFile( fileTempOutPath + ".txt", "utf8", function( error, text ) {
            if (error) {
              error = new Error( "Error reading" + label + " output at [[ " + fileTempOutPath + " ]], error: " + error.message );
              cb( error, null );
            } else {
              fs.unlink( fileTempOutPath + ".txt", function( error ) {
                if (error) {
                  error = new Error( "Error, " + tesseract + " , cleaning up temp file [[ " + fileTempOutPath + " ]], error: " + error.message );
                  cb( error, null );
                } else {
                  cb( null, text.toString() );
                }
              });
            }
          });
        } else {
          error = new Error( "Error reading " + label + " output at [[ " + fileTempOutPath + " ]], file does not exist" );
          cb( error, null );
        }
      });
    }
  );
};

module.exports = {
  createExecOptions: createExecOptions,
  unzipCheck: unzipCheck,
  getTextFromZipFile: getTextFromZipFile,
  yauzlError: yauzlError,
  runExecIntoFile: runExecIntoFile
};
