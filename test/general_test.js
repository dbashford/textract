var path = require('path');

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

  describe('will error out gracefully', function() {

    it('when file does not exist', function(done) {
      var filePath = "foo/bar/foo.txt"
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.message).to.eql( "File at path [[ " + filePath + " ]] does not exist.");
        done();
      });
    });

    it('when file has unrecognized mime type', function(done) {
      var filePath = path.join(__dirname, 'files', 'nope.xls');
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.typeNotFound).to.be.true;
        expect(error.message).to.eql( "textract does not currently extract files of type [[ application/vnd.ms-excel ]]" );
        done();
      });
    });

  });

});
