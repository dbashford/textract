var fs = require("fs")
  , path = require("path")
  , mime = require("mime")
  ;

var test = function(_testFunction, withMime) {

  var testFunction;

  beforeEach(function() {
    testFunction = _testFunction();
  });

  describe('for .html files', function() {

    it('will extract text', function(done) {

      var docPath = path.join( __dirname, "files", "test.html" );
      var textBuff = fs.readFileSync(docPath);
      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, {preserveLineBreaks:true}, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.length).to.eql( 80 );
        expect(text.substring(0, 80)).to.eql("\nThis is a\nlong string\nof text\nthat should get extracted\nwith new lines inserted")
        done();
      });
    });
  });

  describe('for .doc files', function() {
    it('will extract text from actual doc files', function(done) {
      var docPath = path.join( __dirname, "files", "doc.doc" );
      var textBuff = fs.readFileSync(docPath);
      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql( "This is a doc, I promise." );
        done();
      });
    });
  });

  describe('for .xls files', function() {

    it('will extract text', function(done) {
      var docPath = path.join( __dirname, "files", "test.xls" );
      var textBuff = fs.readFileSync(docPath);
      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This,is,a,spreadshee" );
        done();
      });
    });
  });

  describe('for .xlsx files', function() {
    it('will extract text and numbers from XLSX files', function(done) {
      var docPath = path.join( __dirname, "files", "pi.xlsx" );
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql('This is the value of PI:,3.141592 ');
        done();
      });
    });
  });

  describe('for .pdf files', function() {
    it('will extract text from actual pdf files', function(done) {
      var docPath = path.join( __dirname, "files", "pdf.pdf" );
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a test. Please ignore." );
        done();
      });
    });
  });

  describe('for .docx files', function() {
    it('will extract text from actual docx files', function(done) {
      var docPath = path.join( __dirname, "files", "docx.docx" );
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });
  });

  describe('for text/* files', function() {
    it('will extract text from specifically a .txt file', function(done) {
      var docPath = path.join( __dirname, "files", "txt.txt" );
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a plain old text file." );
        done();
      });
    });
  });

  describe('for .pptx files', function() {
    it('will extract text PPTX files', function(done) {
      var docPath = path.join( __dirname, "files", "ppt.pptx" );
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(55,96)).to.eql('ullet 1 Bullet 2 Bullet 3 Number 1 Number');
        done();
      });
    });
  });

  it('for md files', function(done) {
    var docPath = path.join( __dirname, "files", "test.md" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(" This is an h1 This is an h2 This text has been bolded and italicized ");
      done();
    });
  });

  it('will ods files', function(done) {
    var docPath = path.join( __dirname, "files", "ods.ods" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This,is,a,ods Really,it,is, I,promise,, ");
      done();
    });
  });

  it('will ods files', function(done) {
    var docPath = path.join( __dirname, "files", "xml.xml" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(" Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90");
      done();
    });
  });

  it('will odt files', function(done) {
    var docPath = path.join( __dirname, "files", "odt.odt" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This is an ODT THIS IS A HEADING More ODT");
      done();
    });
  });

  it('will potx files', function(done) {
    var docPath = path.join( __dirname, "files", "potx.potx" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This is a potx template Yep, a potx I had no idea These were even a thing ");
      done();
    });
  });

  it('will xltx files', function(done) {
    var docPath = path.join( __dirname, "files", "xltx.xltx" );
    var textBuff = fs.readFileSync(docPath);

    testFunction(
      (withMime) ? mime.lookup( docPath ) : docPath,
      textBuff, function( error, text ) {

      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(",,,,,, Packing Slip ,Your Company Name,,,,\"July 24, 2015\", , Your Company Slogan,,,,, ,,,,,, ,Addres");
      done();
    });
  });

};

describe('textract fromBufferWithName', function() {
  test(function(){ return global.fromBufferWithName }, false);
});

describe('textract fromBufferWithMime', function() {
  test(function(){ return global.fromBufferWithMime }, true);
});
