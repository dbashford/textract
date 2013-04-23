var sysPath = require('path');

describe('textract', function() {

  it('should be a function', function() {
    expect(textract).to.be.an.instanceof(Function);
  });

  describe('when passed incorrect parameters', function() {

    it('should return an error 1', function(done) {
      textract(function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.message).to.eql("Incorrect parameters passed to textract.");
        done();
      });
    });

    it('should return an error 2', function(done) {
      textract(false, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.message).to.eql("Incorrect parameters passed to textract.");
        done();
      });
    });

    it('should return an error 3', function(done) {
      textract(function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.message).to.eql("Incorrect parameters passed to textract.");
        done();
      }, false);
    });

  });

  describe('when passed incorrect parameters', function() {

  });

});
