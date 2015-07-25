var path = require("path");

describe("fromUrl tests", function() {

  describe('for .html files', function() {

    it('will extract text', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/test.html?raw=true";
      fromUrl(url, {preserveLineBreaks:true}, function( error, text ) {
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
      var url = "https://github.com/dbashford/textract/blob/master/test/files/doc.doc?raw=true";
      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql( "This is a doc, I promise.");
        done();
      });
    });
  });

  describe('for .xls files', function() {

    it('will extract text', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/test.xls?raw=true";
      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This,is,a,spreadshee" );
        done();
      });
    });
  });

  describe('for .xlsx files', function() {
    it('will extract text and numbers from XLSX files', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/pi.xlsx?raw=true";

      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql('This is the value of PI:,3.141592 ');
        done();
      });
    });
  });

  describe('for .pdf files', function() {
    it('will extract text from actual pdf files', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/pdf.pdf?raw=true";

      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a test. Please ignore." );
        done();
      });
    });
  });

  describe('for .docx files', function() {
    it('will extract text from actual docx files', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/docx.docx?raw=true";

      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This is a test Just " );
        done();
      });
    });
  });

  describe('for text/* files', function() {
    it('will extract text from specifically a .txt file', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/txt.txt?raw=true";

      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a plain old text file." );
        done();
      });
    });
  });

  describe('for .pptx files', function() {
    it('will extract text PPTX files', function(done) {
      var url = "https://github.com/dbashford/textract/blob/master/test/files/ppt.pptx?raw=true";

      fromUrl(url, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(55,96)).to.eql('ullet 1 Bullet 2 Bullet 3 Number 1 Number');
        done();
      });
    });
  });

  it('for md files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/test.md?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(" This is an h1 This is an h2 This text has been bolded and italicized ");
      done();
    });
  });

  it('will ods files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/ods.ods?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This,is,a,ods Really,it,is, I,promise,, ");
      done();
    });
  });

  it('will xml files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/xml.xml?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(" Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90");
      done();
    });
  });

  it('will odt files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/odt.odt?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This is an ODT THIS IS A HEADING More ODT");
      done();
    });
  });

  it('will potx files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/potx.potx?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql("This is a potx template Yep, a potx I had no idea These were even a thing ");
      done();
    });
  });

  it('will xltx files', function(done) {
    var url = "https://github.com/dbashford/textract/blob/master/test/files/xltx.xltx?raw=true";

    fromUrl(url, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      expect(text.substring(0,100)).to.eql(",,,,,, Packing Slip ,Your Company Name,,,,\"July 24, 2015\", , Your Company Slogan,,,,, ,,,,,, ,Addres");
      done();
    });
  });

});