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

  it('will extract text from actual xls files', function(done) {
    var docPath = path.join( __dirname, "files", "test.xls" );
    textract(docPath, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.a('string');
      expect(text.substring(0,20)).to.eql( "\"This\",\"is\",\"a\",\"spr" );
      done();
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

    it('will not extract smashed together text', function(done) {
      var filePath = path.join( __dirname, "files", "testresume.docx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,31)).to.eql( "Karol Miner 336 W. Chugalug Way" );
        done();
      });
    });

  });

  describe('for text/* files', function() {
    it('will extract text from specifically a .txt file', function(done) {
      var filePath = path.join( __dirname, "files", "txt.txt" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a plain old text file." );
        done();
      });
    });

    it('will extract text specifically from a .css file', function(done) {
      var filePath = path.join( __dirname, "files", "css.css" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( ".foo {color:red}" );
        done();
      });
    });

    it('will extract text specifically from a .js file', function(done) {
      var filePath = path.join( __dirname, "files", "js.js" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "console.log(\"javascript is cooler than you\")" );
        done();
      });
    });

    it('will remove extraneous white space from a .txt file', function(done) {
      var filePath = path.join( __dirname, "files", "spacey.txt" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "this has lots of space" );
        done();
      });
    });

  });

});
