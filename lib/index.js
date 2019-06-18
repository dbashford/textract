var fs = require( 'fs' )
  , path = require( 'path' )
  , mime = require( 'mime' )
  , extract = require( './extract' )
  , os = require( 'os' )
  , got = require( 'got' )
  , tmpDir = os.tmpdir()
  ;

function _genRandom() {
  return Math.floor( ( Math.random() * 100000000000 ) + 1 );
}

function _extractWithType( type, filePath, options, cb ) {
  fs.exists( filePath, function( exists ) {
    if ( exists ) {
      extract( type, filePath, options, cb );
    } else {
      cb( new Error( 'File at path [[ ' + filePath + ' ]] does not exist.' ), null );
    }
  });
}

function _returnArgsError( _args ) {
  var args = Array.prototype.slice.call( _args )
    , callback
    ;

  args.forEach( function( parm ) {
    if ( parm && typeof parm === 'function' ) {
      callback = parm;
    }
  });

  if ( callback ) {
    callback( new Error( 'Incorrect parameters passed to textract.' ), null );
  } else {
    // eslint-disable-next-line no-console
    console.error( 'textract could not find a callback function to execute.' );
  }
}

function _writeBufferToDisk( buff, cb ) {
  var fullPath = path.join( tmpDir, 'textract_file_' + _genRandom() );

  fs.open( fullPath, 'w', function( err, fd ) {
    if ( err ) {
      throw new Error( 'error opening temp file: ' + err );
    } else {
      fs.write( fd, buff, 0, buff.length, null, function( err2 ) {
        if ( err2 ) {
          throw new Error( 'error writing temp file: ' + err2 );
        } else {
          fs.close( fd, function() {
            cb( fullPath );
          });
        }
      });
    }
  });
}

function fromFileWithMimeAndPath( type, filePath, options, cb ) {
  var called = false;

  if ( typeof type === 'string' && typeof filePath === 'string' ) {
    if ( typeof cb === 'function' && typeof options === 'object' ) {
      // (mimeType, filePath, options, callback)
      _extractWithType( type, filePath, options, cb );
      called = true;
    } else if ( typeof options === 'function' && cb === undefined ) {
      // (mimeType, filePath, callback)
      _extractWithType( type, filePath, {}, options );
      called = true;
    }
  }

  if ( !called ) {
    _returnArgsError( arguments );
  }
}

function fromFileWithPath( filePath, options, cb ) {
  var type;
  if ( typeof filePath === 'string' &&
       ( typeof options === 'function' || typeof cb === 'function' ) ) {
    type = ( options && options.typeOverride ) || mime.getType( filePath );
    fromFileWithMimeAndPath( type, filePath, options, cb );
  } else {
    _returnArgsError( arguments );
  }
}

// eslint-disable-next-line no-unused-vars
function fromBufferWithMime( type, bufferContent, options, cb, withPath ) {
  if ( typeof type === 'string' &&
       bufferContent &&
       bufferContent instanceof Buffer &&
       ( typeof options === 'function' || typeof cb === 'function' ) ) {
    _writeBufferToDisk( bufferContent, function( newPath ) {
      fromFileWithMimeAndPath( type, newPath, options, cb );
    });
  } else {
    _returnArgsError( arguments );
  }
}

function fromBufferWithName( filePath, bufferContent, options, cb ) {
  var type;
  if ( typeof filePath === 'string' ) {
    type = mime.getType( filePath );
    fromBufferWithMime( type, bufferContent, options, cb, true );
  } else {
    _returnArgsError( arguments );
  }
}

function fromUrl( url, options, cb ) {
  var urlNoQueryParams, extname, filePath, fullFilePath, file, href, callbackCalled, _options, _cb;

  // allow url to be either a string or to be a
  // Node URL Object: https://nodejs.org/api/url.html
  href = ( typeof url === 'string' ) ? url : url.href;

  if ( href ) {
    options = options || {};
    urlNoQueryParams = href.split( '?' )[0];
    extname = path.extname( urlNoQueryParams );
    filePath = _genRandom() + extname;
    fullFilePath = path.join( tmpDir, filePath );
    file = fs.createWriteStream( fullFilePath );
    file.on( 'finish', function() {
      if ( !callbackCalled ) {
        _options = options;
        _cb = cb;
        if ( typeof options === 'function' ) {
          _options = function( error, text ) {
            // check if downloaded file still exists
            fs.exists( fullFilePath, ( exists ) => {
              if ( exists ) {
                // remove the temporary file
                fs.unlink( fullFilePath, ( ) => {
                  options( error, text );
                });
              } else {
                options( error, text );
              }
            });
          };
        } else if ( typeof cb === 'function' ) {
          _cb = function( error, text ) {
            // check if downloaded file still exists
            fs.exists( fullFilePath, ( exists ) => {
              if ( exists ) {
                // remove the temporary file
                fs.unlink( fullFilePath, ( ) => {
                  cb( error, text );
                });
              } else {
                cb( error, text );
              }
            });
          };
        }
        fromFileWithPath( fullFilePath, _options, _cb );
      }
    });

    got.stream( url )
      .on( 'response', function( response ) {
        // allows for overriding by the developer or automatically
        // populating based on server response.
        if ( !options.typeOverride ) {
          options.typeOverride = response.headers['content-type'].split( /;/ )[0];
        }
      })
      .on( 'error', function( error ) {
        _cb = ( typeof options === 'function' ) ? options : cb;
        callbackCalled = true;
        _cb( error );
      })
      .pipe( file );
  } else {
    _returnArgsError( arguments );
  }
}

module.exports = {
  fromFileWithPath: fromFileWithPath,
  fromFileWithMimeAndPath: fromFileWithMimeAndPath,
  fromBufferWithName: fromBufferWithName,
  fromBufferWithMime: fromBufferWithMime,
  fromUrl: fromUrl
};
