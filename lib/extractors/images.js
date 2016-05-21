var exec = require( 'child_process' ).exec
  , path = require( 'path' )
  , fs = require( 'fs' )
  , mime = require( 'mime' )
  , os = require( 'os' )
  , util = require( '../util' )
  , outDir = path.join( os.tmpdir(), "textract" )
  ;

var generateCommand = function(options, inputFile, outputFile) {
  var cmd = "tesseract " + inputFile + " " + outputFile;
  if ( options.tesseract && options.tesseract.lang ) {
    cmd += " -l " + options.tesseract.lang;
  }
  cmd += " quiet";
  return cmd;
};

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// capable of building a command, running that command against an input file
// resulting in an output file, reading that file and executing a 
// callback with the contents
var runExecIntoFile = function(label, filePath, options, execOptions, genCommand, cb) {
  // escape the file paths
  var fileTempOutPath = path.join( outDir, path.basename( filePath, path.extname( filePath ) ) );
  var escapedFilePath = filePath.replace(/\s/g, '\\ ');
  var escapedFileTempOutPath = fileTempOutPath.replace(/\s/g, '\\ ');
  var cmd = genCommand(options, escapedFilePath, escapedFileTempOutPath);
 
  exec( cmd, execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "Error extracting [[ " + path.basename( filePath )  + " ]], exec error: " + error.message );
        cb( error, null );
        return;
      }

      fs.exists(fileTempOutPath + ".txt", function( exists ) {
        if ( exists ) {
          fs.readFile(fileTempOutPath + ".txt", "utf8", function( error, text ) {
            if (error) {
              error = new Error( "Error reading" + label + " output at [[ " + fileTempOutPath + " ]], error: " + error.message );
              cb( error, null );
            } else {
              fs.unlink(fileTempOutPath + ".txt", function(error) {
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

var extractText = function( filePath, options, cb ) {
  var execOptions = util.createExecOptions( "images", options );
  runExecIntoFile( "tesseract", filePath, options, execOptions, generateCommand, cb );
};

var testForBinary = function( options, cb ) {
  exec('tesseract',
    function (error, stdout, stderr) {
      if (error && error.toString().indexOf("tesseract") > -1 || stderr && stderr.toString().indexOf("tesseract") > -1) {
        cb( true );
      } else {
        var msg = "INFO: 'tesseract' does not appear to be installed, so textract will be unable to extract images.";
        cb( false, msg );
      }
    }
  );
};

module.exports = {
  types: ["image/png", "image/jpeg", "image/gif"],
  extract: extractText,
  test: testForBinary
};