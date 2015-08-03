var fs = require( "fs" )
  , path = require( "path" )
  , mime = require( "mime" )
  , extract = require( "./extract" )
  , os = require( "os" )
  , got = require( "got" )
  , tmpDir = os.tmpdir()
  ;

var _genRandom = function() {
  return Math.floor(( Math.random() * 100000000000 ) + 1 );
};

var _extractWithType = function( type, filePath, options, cb ) {
  fs.exists( filePath, function( exists ) {
    if ( exists ) {
      extract( type, filePath, options, cb );
    } else {
      cb( new Error( "File at path [[ " + filePath + " ]] does not exist." ), null );
    }
  });
};

var _returnArgsError = function( _args ) {
  var args = Array.prototype.slice.call( _args )
    , callback
    ;

  args.forEach(function( parm ) {
    if ( parm && typeof parm === "function" ) {
      callback = parm;
    }
  });

  if (callback) {
    callback( new Error( "Incorrect parameters passed to textract." ), null );
  } else {
    console.error( "textract could not find a callback function to execute." );
  }
};

var _writeBufferToDisk = function( buff, cb ) {
  var fullPath = path.join( tmpDir, "textract_file_" + _genRandom() );

  fs.open(fullPath, "w", function(err, fd) {
    if (err) {
      throw new Error( "error opening temp file: " + err );
    } else {
      fs.write(fd, buff, 0, buff.length, null, function( err ) {
        if ( err ) {
          throw new Error( "error writing temp file: " + err );
        } else {
          fs.close(fd, function() {
            cb( fullPath );
          });
        }
      });
    }
  });
};

var fromFileWithMimeAndPath = function( type, filePath, options, cb ) {
  var called = false;
  //process.exit();
  if ( typeof type === "string" && typeof filePath === "string" ) {
    if ( typeof cb === "function" && typeof options === "object" ) {
      // (mimeType, filePath, options, callback)
      _extractWithType( type, filePath, options, cb );
      called = true;
    } else if ( typeof options === "function" && cb === undefined ) {
      // (mimeType, filePath, callback)
      _extractWithType( type, filePath, {}, options );
      called = true;
    }
  }

  if ( !called ) {
    _returnArgsError( arguments );
  }
};

var fromFileWithPath = function( filePath, options, cb ) {
  if ( typeof filePath === "string" &&
       ( typeof options === "function" || typeof cb === "function" ) ) {
    var type = mime.lookup( filePath );
    fromFileWithMimeAndPath( type, filePath, options, cb );
  } else {
    _returnArgsError( arguments );
  }
};

var fromBufferWithMime = function( type, bufferContent, options, cb, withPath ) {
  if ( typeof type === "string" &&
       bufferContent &&
       bufferContent instanceof Buffer &&
       ( typeof options === "function" || typeof cb === "function" ) ) {

    _writeBufferToDisk( bufferContent, function( newPath ) {
      fromFileWithMimeAndPath( type, newPath, options, cb );
    });
  } else {
    _returnArgsError( arguments );
  }
};

var fromBufferWithName = function( filePath, bufferContent, options, cb ) {
  if ( typeof filePath === "string") {
    var type = mime.lookup( filePath );
    fromBufferWithMime( type, bufferContent, options, cb, true );
  } else {
    _returnArgsError( arguments );
  }
};

var fromUrl = function( url, options, cb ) {
  if ( typeof url === "string" ) {

    var urlNoQueryParams = url.split("?")[0]
      , extname = path.extname( urlNoQueryParams )
      , filePath = _genRandom() + urlNoQueryParams.replace(/[^\w\s]/gi, "") + extname
      , fullFilePath = path.join( tmpDir, filePath )
      ;

    var file = fs.createWriteStream(fullFilePath);
    file.on('finish', function() {
      fromFileWithPath( fullFilePath, options, cb );
    });
    got(url).pipe(file);
  } else {
    _returnArgsError( arguments );
  }
};

module.exports = {
  fromFileWithPath: fromFileWithPath,
  fromFileWithMimeAndPath: fromFileWithMimeAndPath,
  fromBufferWithName: fromBufferWithName,
  fromBufferWithMime: fromBufferWithMime,
  fromUrl: fromUrl
};
