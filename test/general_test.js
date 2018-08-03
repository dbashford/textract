/* eslint-disable max-len, no-unused-expressions */
/* global textract, fromFileWithPath, fromFileWithMimeAndPath, fromBufferWithName, fromBufferWithMime, fromUrl */

var path = require( 'path' )
  , fs = require( 'fs' )
  ;

describe( 'textract', function() {
  it( 'should be an object', function() {
    expect( textract ).to.be.an.instanceof( Object );
  });

  it( 'properties should be functions', function() {
    expect( typeof fromFileWithPath ).to.eql( 'function' );
    expect( typeof fromFileWithMimeAndPath ).to.eql( 'function' );
    expect( typeof fromBufferWithName ).to.eql( 'function' );
    expect( typeof fromBufferWithMime ).to.eql( 'function' );
    expect( typeof fromUrl ).to.eql( 'function' );
  });

  describe( 'will error out gracefully', function() {
    it( 'when file does not exist', function( done ) {
      var filePath = 'foo/bar/foo.txt';
      fromFileWithPath( filePath, function( error, text ) {
        expect( text ).to.be.null;
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.an( 'string' );
        expect( error.message ).to.eql( 'File at path [[ ' + filePath + ' ]] does not exist.' );
        done();
      });
    });

    it( 'when file has unregistered mime type', function( done ) {
      var filePath = path.join( __dirname, 'files', 'MxAgCrProd.ppt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( text ).to.be.null;
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.an( 'string' );
        expect( error.typeNotFound ).to.be.true;
        expect( error.message.substring( 0, 61 ) ).to.eql( 'Error for type: [[ application/vnd.ms-powerpoint ]], file: [[' );
        done();
      });
    });
  });

  it( 'can handle types of varying cases', function( done ) {
    var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
    fromFileWithMimeAndPath( 'appLication/vnd.openXMLformats-Officedocument.WordProcessingml.Document', filePath, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.a( 'string' );
      expect( text.substring( 0, 38 ) ).to.eql( 'This is a test Just so you know: Lorem' );
      done();
    });
  });

  it( 'can handle a text file with parens', function( done ) {
    var filePath = path.join( __dirname, 'files', 'new doc(1).txt' );
    fromFileWithPath( filePath, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.a( 'string' );
      expect( text ).to.eql( 'text!!!' );
      done();
    });
  });

  it( 'can handle a docx file with parens', function( done ) {
    var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
    fromFileWithPath( filePath, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.a( 'string' );
      expect( text.substring( 0, 20 ) ).to.eql( 'This is a test Just ' );
      done();
    });
  });

  it( 'can handle cyrillic', function( done ) {
    var filePath = path.join( __dirname, 'files', 'cyrillic.docx' );
    fromFileWithPath( filePath, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.a( 'string' );
      expect( text.substring( 0, 100 ) ).to.eql( 'Актуальность диссертационного исследования определяется необходимостью развития методологического об' );
      done();
    });
  });

  it( 'can handle special chinese characters', function( done ) {
    var filePath = path.join( __dirname, 'files', 'chi.txt' );
    fromFileWithPath( filePath, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.a( 'string' );
      expect( text.substring( 0, 100 ) ).to.eql( '，卧虎藏龙卧' );
      done();
    });
  });

  describe( 'with multi line files', function() {
    it( 'strips line breaks', function( done ) {
      var filePath = path.join( __dirname, 'files', 'multi-line.txt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This file has a bunch of line breaks in it, and it also has some useful punctuation.' );
        done();
      });
    });

    it( 'does not strip line breaks when configured as such', function( done ) {
      var filePath = path.join( __dirname, 'files', 'multi-line.txt' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This file\nhas a bunch\nof line breaks\nin it, and it also\nhas some useful\npunctuation.' );
        done();
      });
    });

    it( 'will only strip single line breaks when requested', function( done ) {
      var filePath = path.join( __dirname, 'files', 'line-breaks.txt' );
      fromFileWithPath( filePath, { preserveOnlyMultipleLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This is a text file\n\nthat has a combination of multiple\n\n\n\nand single line breaks, for use when testing the preserveOnlyMultipleLineBreaks option that keeps only\n\n\nmultiple line breaks.' );
        done();
      });
    });
  });

  describe( 'can handle all the different API variations', function() {
    var test = function( done ) {
      return function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 20 ) ).to.eql( 'This is a test Just ' );
        done();
      };
    };

    it( 'fromFileWithPath(filePath, callback) ', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
      fromFileWithPath( filePath, test( done ) );
    });

    it( 'fromFileWithPath(filePath, options, callback) ', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
      fromFileWithPath( filePath, {}, test( done ) );
    });

    it( 'fromFileWithMimeAndPath(mimeType, filePath, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
      fromFileWithMimeAndPath( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', filePath, test( done ) );
    });

    it( 'fromFileWithMimeAndPath(mimeType, filePath, options, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' );
      fromFileWithMimeAndPath( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', filePath, {}, test( done ) );
    });

    it( 'fromBufferWithMime(mimeType, buffer, options, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' )
        , textBuff = fs.readFileSync( filePath )
        ;

      fromBufferWithMime( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', textBuff, {}, test( done ) );
    });

    it( 'fromBufferWithMime(mimeType, buffer, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' )
        , textBuff = fs.readFileSync( filePath )
        ;

      fromBufferWithMime( 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', textBuff, test( done ) );
    });

    it( 'fromBufferWithName(fileName, buffer, options, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' )
        , textBuff = fs.readFileSync( filePath )
        ;

      fromBufferWithName( filePath, textBuff, {}, test( done ) );
    });

    it( 'fromBufferWithName(fileName, buffer, callback)', function( done ) {
      var filePath = path.join( __dirname, 'files', 'new docx(1).docx' )
        , textBuff = fs.readFileSync( filePath )
        ;

      fromBufferWithName( filePath, textBuff, test( done ) );
    });

    it( 'fromUrl(url, options, callback)', function( done ) {
      var url = 'https://cdn.rawgit.com/dbashford/textract/master/test/files/new%20docx(1).docx?raw=true';
      fromUrl( url, {}, test( done ) );
    });

    it( 'fromUrl1(url,callback)', function( done ) {
      var url = 'https://cdn.rawgit.com/dbashford/textract/master/test/files/new%20docx(1).docx?raw=true';
      fromUrl( url, test( done ) );
    });
  });
});
