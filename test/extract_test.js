var path = require('path');

describe('textract', function() {

  describe('for .doc files', function() {
    it('will extract text from actual doc files', function(done) {
      var docPath = path.join( __dirname, "files", "doc.doc" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql( "This is a doc, I promise." );
        done();
      });
    });

    it('will extract text from text files masquerading as doc files', function(done) {
      var docPath = path.join( __dirname, "files", "notadoc.doc" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql( "not a doc" );
        done();
      });
    });
  });

  describe('for .pdf files', function() {
    it('will extract text from actual pdf files', function(done) {
      var filePath = path.join( __dirname, "files", "pdf.pdf" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a test. Please ignore." );
        done();
      });
    });

    it('will error out when pdf file isn\'t actually a pdf', function(done) {
      var filePath = path.join( __dirname, "files", "notapdf.pdf" );
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.a('string');
        expect(error.message.substring(0,34)).to.eql( "Error extracting PDF text for file" );
        done();
      });
    });
  });

  describe('for .docx files', function() {
    it('will extract text from actual docx files', function(done) {
      var filePath = path.join( __dirname, "files", "docx.docx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });

    it('will error out when docx file isn\'t actually a docx', function(done) {
      var filePath = path.join( __dirname, "files", "notadocx.docx" );
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.a('string');
        expect(error.message.substring(0,20)).to.eql( "No text found, error");
        done();
      });
    });
  });

});
