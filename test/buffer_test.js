var fs = require("fs")
  , path = require("path")
  , mime = require("mime")
  ;

var test = function(_testFunction, withMime) {

  var testFunction;

  beforeEach(function() {
    testFunction = _testFunction();
  });

  var _test = function(ext, name, _text) {
    it('will ' + ext + ' files', function(done) {
      var docPath = path.join( __dirname, "files", name);
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.getType( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,100)).to.eql(_text);
        done();
      });
    });
  };

  _test(
    "html",
    "test.html",
    " This is a long string of text that should get extracted with new lines inserted"
  )

  _test(
    "doc",
    "doc.doc",
    " Word Specification Sample Working Draft 04, 16 August 2002 Document identifier: wd-spectools-word-s"
  );

  _test(
    "xls",
    "test.xls",
    "This,is,a,spreadsheet,yay! "
  );

  _test(
    "xlsx",
    "pi.xlsx",
    'This is the value of PI:,3.141592 '
  );

  _test(
    "pdf",
    "pdf.pdf",
    "This is a test. Please ignore."
  );

  _test(
    "docx",
    "docx.docx",
    "This is a test Just so you know: Lorem ipsum dolor sit amet, consecutuer adipiscing elit, sed diam n"
  );

  _test(
    "text/*",
    "txt.txt",
    "This is a plain old text file."
  );

  _test(
    "pptx",
    "ppt.pptx",
    "This is some title Text And a sub-title Text in Lists Bullet 1 Bullet 2 Bullet 3 Number 1 Number 2 N"
  );

  _test(
    "markdown",
    "test.md",
    " This is an h1 This is an h2 This text has been bolded and italicized "
  );

  _test(
    "ods",
    "ods.ods",
    "This,is,a,ods Really,it,is, I,promise,, "
  );

  _test(
    "xml",
    "xml.xml",
    " Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90"
  );

  _test(
    "odt",
    "odt.odt",
    "This is an ODT THIS IS A HEADING More ODT"
  );

  _test(
    "potx",
    "potx.potx",
    "This is a potx template Yep, a potx I had no idea These were even a thing "
  );

  _test(
    "xltx",
    "xltx.xltx",
    ",,,,,, Packing Slip ,Your Company Name,,,,\"July 24, 2015\", , Your Company Slogan,,,,, ,,,,,, ,Addres"
  );

  _test(
    "ott",
    "ott.ott",
    "This is a document template, yay templates! Woo templates get me so excited!"
  );

  _test(
    "ots",
    "ots.ots",
    "This,is , template, an,open,office,template isn't,it,awesome?, you,know,it,is "
  );

  _test(
    'odg',
    'odg.odg',
    "This is a drawing? A drawing, a drawing! This is a drawing, Aren't you mad envious?"
  );

  _test(
    'otg',
    'otg.otg',
    "This is a drawing template A drawing template. Who would really ever need to extract from one of the"
  );

  _test(
    'odp',
    'odp.odp',
    "This is a title This is a slide's text This is a 2nd page And a 2nd page's content"
  );

  _test(
    'otp',
    'otp.otp',
    "This is a template title Template page text 2nd prezo text"
  );

};

describe('textract fromBufferWithName', function() {
  test(function(){ return global.fromBufferWithName }, false);
});

describe('textract fromBufferWithMime', function() {
  test(function(){ return global.fromBufferWithMime }, true);
});
