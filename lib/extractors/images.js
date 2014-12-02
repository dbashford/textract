var exec = require( 'child_process' ).exec
  , path = require( 'path' )
  , fs = require( 'fs' )
  , mime = require( 'mime' )
  , os = require( 'os' )
  , outDir = path.join( os.tmpdir(), "textract" );

var extractText = function( filePath, options, cb ) {
  var fileTempOutPath = path.join(outDir, path.basename(filePath, path.extname(filePath)))
    , execOptions = {};

  if (options.images && options.images.exec) {
    execOptions = options.images.exec;
  } else {
    if (options.images) {
      execOptions = options.images;
    }
  }

  // escape the paths for the tesseract command
  var escapedFilePath = filePath.replace(/\s/g, '\\ ');
  var escapedFileTempOutPath = fileTempOutPath.replace(/\s/g, '\\ ');

  var tesseractCmd = "tesseract " + escapedFilePath + " " + escapedFileTempOutPath;
  if ( options.tesseract && options.tesseract.lang ) {
    tesseractCmd += " -l " + options.tesseract.lang;
  }
  tesseractCmd += " quiet";

  exec( tesseractCmd, execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "Error extracting [[ " + filePath + " ]], exec error: " + error );
        cb( error, null );
        return;
      }

      fs.exists(fileTempOutPath + ".txt", function( exists ) {
        if ( exists ) {
          fs.readFile(fileTempOutPath + ".txt", "utf8", function( error, text ) {
            if (error) {
              error = new Error( "Error reading tesseract output at [[ " + fileTempOutPath + " ]], error: " + error );
              cb( error, null );
            } else {
              fs.unlink(fileTempOutPath + ".txt", function(error) {
                if (error) {
                  error = new Error( "Error, tesseract, cleaning up temp file [[ " + fileTempOutPath + " ]], error: " + error );
                  cb( error, null );
                } else {
                  cb( null, text.toString() )
                }
              })
            }
          });
        } else {
          error = new Error( "Error reading tesseract output at [[ " + fileTempOutPath + " ]], file does not exist" );
          cb( error, null );
        }
      });
    }
  );
};

var testForBinary = function( cb ) {
  exec('tesseract',
    function (error, stdout, stderr) {
      if (error && error.toString().indexOf("tesseract") > -1 || stderr && stderr.toString().indexOf("tesseract") > -1) {
        cb( true );
      } else {
        console.error( "textract: 'tesseract' does not appear to be installed, so it will be unable to extract images." );
        cb( false );
      }
    }
  );
};

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

module.exports = {
  types: ["image/png", "image/jpeg", "image/gif"],
  extract: extractText,
  test: testForBinary
};