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
      var filePath = path.join(__dirname, 'files', 'nope.xlsx');
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.an('string');
        expect(error.typeNotFound).to.be.true;
        expect(error.message).to.eql( "textract does not currently extract files of type [[ application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ]]" );
        done();
      });
    });

  });

  it('can handle a text file with parens', function(done) {
    var filePath = path.join(__dirname, 'files', 'new doc(1).txt');
    textract(filePath, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.a('string');
      expect(text).to.eql( "text!!!" );
      done();
    });
  });


  it('can handle a docx file with parens', function(done) {
    var filePath = path.join(__dirname, 'files', 'new docx(1).docx');
    textract(filePath, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.a('string');
      expect(text.substring(0,20)).to.eql( "This is a test Just " );
      done();
    });
  });

  describe('can handle all the different API variations', function() {
    // textract(filePath, callback)
    // textract(mimeType, filePath, callback)
    // textract(filePath, options, callback)
    // textract(mimeType, filePath, options, callback)


    it('textract(filePath, callback) ', function(done) {
      var filePath = path.join(__dirname, 'files', 'new docx(1).docx');
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });

    it('textract(mimeType, filePath, callback)', function(done) {
      var filePath = path.join(__dirname, 'files', 'new docx(1).docx');
      textract('application/vnd.openxmlformats-officedocument.wordprocessingml.document', filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });

    it('textract(mimeType, filePath, options, callback)', function(done) {
      var filePath = path.join(__dirname, 'files', 'new docx(1).docx');
      textract('application/vnd.openxmlformats-officedocument.wordprocessingml.document', filePath, {}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });

    it('textract(filePath, options, callback) ', function(done) {
      var filePath = path.join(__dirname, 'files', 'new docx(1).docx');
      textract(filePath, {}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });

  })

});
