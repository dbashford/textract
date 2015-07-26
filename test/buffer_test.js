var fs = require("fs")
  , path = require("path")
  , mime = require("mime")
  ;

var test = function(_testFunction, withMime) {

  var testFunction;

  beforeEach(function() {
    testFunction = _testFunction();
  });

  var test = function(ext, name, _text) {
    it('will ' + ext + ' files', function(done) {
      var docPath = path.join( __dirname, "files", name);
      var textBuff = fs.readFileSync(docPath);

      testFunction(
        (withMime) ? mime.lookup( docPath ) : docPath,
        textBuff, function( error, text ) {

        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,100)).to.eql(_text);
        done();
      });
    });
  };

  test(
    "html",
    "test.html",
    " This is a long string of text that should get extracted with new lines inserted"
  )

  test(
    "doc",
    "doc.doc",
    "This is a doc, I promise."
  );

  test(
    "xls",
    "test.xls",
    "This,is,a,spreadsheet,yay! "
  );

  test(
    "xlsx",
    "pi.xlsx",
    'This is the value of PI:,3.141592 '
  );

  test(
    "pdf",
    "pdf.pdf",
    "This is a test. Please ignore."
  );

  test(
    "docx",
    "docx.docx",
    "This is a test Just so you know: Lorem ipsum dolor sit amet, consecutuer adipiscing elit, sed diam n"
  );

  test(
    "text/*",
    "txt.txt",
    "This is a plain old text file."
  );

  test(
    "pptx",
    "ppt.pptx",
    "This is some title Text And a sub-title Text in Lists Bullet 1 Bullet 2 Bullet 3 Number 1 Number 2 N"
  );

  test(
    "markdown",
    "test.md",
    " This is an h1 This is an h2 This text has been bolded and italicized "
  );

  test(
    "ods",
    "ods.ods",
    "This,is,a,ods Really,it,is, I,promise,, "
  );

  test(
    "xml",
    "xml.xml",
    " Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90"
  );

  test(
    "odt",
    "odt.odt",
    "This is an ODT THIS IS A HEADING More ODT"
  );

  test(
    "potx",
    "potx.potx",
    "This is a potx template Yep, a potx I had no idea These were even a thing "
  );

  test(
    "xltx",
    "xltx.xltx",
    ",,,,,, Packing Slip ,Your Company Name,,,,\"July 24, 2015\", , Your Company Slogan,,,,, ,,,,,, ,Addres"
  );

  test(
    "ott",
    "ott.ott",
    "This is a document template, yay templates! Woo templates get me so excited! Woo templates get me so"
  );

  test(
    "ots",
    "ots.ots",
    "This,is , template, an,open,office,template isn't,it,awesome?, you,know,it,is "
  );

  test(
    'odg',
    'odg.odg',
    "This is a drawing? A drawing, a drawing! This is a drawing, Aren't you mad envious?"
  );

  test(
    'otg',
    'otg.otg',
    "This is a drawing template A drawing template. Who would really ever need to extract from one of the"
  );

};

describe('textract fromBufferWithName', function() {
  test(function(){ return global.fromBufferWithName }, false);
});

describe('textract fromBufferWithMime', function() {
  test(function(){ return global.fromBufferWithMime }, true);
});
