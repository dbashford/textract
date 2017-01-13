/* global fromUrl */

var test = function( done ) {
  return function( error, text ) {
    expect( text ).to.be.null;
    expect( error ).to.be.an( 'object' );
    expect( error.message ).to.be.an( 'string' );
    expect( error.message ).to.eql( 'Incorrect parameters passed to textract.' );
    done();
  };
};

var pathTests = function( testFunction ) {

  var funct;

  beforeEach( function() {
    funct = testFunction();
  });

  it( 'should return an error 1', function( done ) {
    funct( test( done ) );
  });

  it( 'should return an error 2', function( done ) {
    funct( false, test( done ) );
  });

  it( 'should return an error 3', function( done ) {
    funct( test( done ), false );
  });

  it( 'should return an error 4', function( done ) {
    funct( 'foo', test( done ), false );
  });

  it( 'should return an error 5', function( done ) {
    funct( 'foo', {}, false, test( done ) );
  });
};

var bufferTests = function( testFunction ) {

  var funct;

  beforeEach( function() {
    funct = testFunction();
  });

  it( 'should return an error 1', function( done ) {
    funct( test( done ) );
  });

  it( 'should return an error 2', function( done ) {
    funct( false, test( done ) );
  });

  it( 'should return an error 3', function( done ) {
    funct( test( done ), false );
  });

  it( 'should return an error 4', function( done ) {
    funct( 'foo', test( done ), false );
  });

  it( 'should return an error 5', function( done ) {
    funct( 'foo', {}, false, test( done ) );
  });
};

describe( 'when passed incorrect parameters', function() {
  describe( 'fromFileWithPath', function() {
    pathTests( function() { return global.fromFileWithPath; }, false );
  });

  describe( 'fromFileWithMimeAndPath', function() {
    pathTests( function() { return global.fromFileWithMimeAndPath; }, false );
  });

  describe( 'fromBufferWithName', function() {
    bufferTests( function() { return global.fromBufferWithName; }, false );
  });

  describe( 'fromBufferWithMime', function() {
    bufferTests( function() { return global.fromBufferWithMime; }, false );
  });
});
