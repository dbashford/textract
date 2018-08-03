/* eslint-disable max-len, no-unused-expressions */
/* global fromUrl */

var nodeUrl = require( 'url' );

describe( 'fromUrl tests', function() {
  var test;

  this.timeout( 3000 );

  it( 'will properly extract files from sites with extensions that are misleading', function( done ) {
    var url = 'http://apps.leg.wa.gov/billinfo/summary.aspx?bill=1276';
    fromUrl( url, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.an( 'string' );
      expect( text.substring( 0, 100 ) ).to.eql(
        ' Washington State Legislature Bill Summary 2017-2018 2015-2016 2013-2014 2011-2012 2009-2010 2007-20' );
      done();
    });
  });

  it( 'take object URL', function( done ) {
    var url = 'https://cdn.rawgit.com/dbashford/textract/master/test/files/doc.doc?raw=true'
      , urlObj = nodeUrl.parse( url )
      ;

    fromUrl( urlObj, function( error, text ) {
      expect( error ).to.be.null;
      expect( text ).to.be.an( 'string' );
      expect( text.substring( 0, 100 ) ).to.eql( ' Word Specification Sample Working Draft 04, 16 August 2002 Document identifier: wd-spectools-word-s' );
      done();
    });
  });

  test = function( ext, name, _text ) {
    it( 'will ' + ext + ' files', function( done ) {
      var url = 'https://cdn.rawgit.com/dbashford/textract/master/test/files/' + name + '?raw=true';
      fromUrl( url, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( _text );
        done();
      });
    });
  };

  test(
    'doc',
    'doc.doc',
    ' Word Specification Sample Working Draft 04, 16 August 2002 Document identifier: wd-spectools-word-s'
  );

  test(
    'xls',
    'test.xls',
    'This,is,a,spreadsheet,yay! '
  );

  test(
    'xlsx',
    'pi.xlsx',
    'This is the value of PI:,3.141592 '
  );

  test(
    'pdf',
    'pdf.pdf',
    'This is a test. Please ignore.'
  );

  test(
    'docx',
    'docx.docx',
    'This is a test Just so you know: Lorem ipsum dolor sit amet, consecutuer adipiscing elit, sed diam n'
  );

  test(
    'text/*',
    'txt.txt',
    'This is a plain old text file.'
  );

  test(
    'pptx',
    'ppt.pptx',
    'This is some title Text And a sub-title Text in Lists Bullet 1 Bullet 2 Bullet 3 Number 1 Number 2 N'
  );

  test(
    'markdown',
    'test.md',
    ' This is an h1 This is an h2 This text has been bolded and italicized '
  );

  test(
    'ods',
    'ods.ods',
    'This,is,a,ods Really,it,is, I,promise,, '
  );

  test(
    'xml',
    'xml.xml',
    ' Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90'
  );

  test(
    'odt',
    'odt.odt',
    'This is an ODT THIS IS A HEADING More ODT'
  );

  test(
    'potx',
    'potx.potx',
    'This is a potx template Yep, a potx I had no idea These were even a thing '
  );

  test(
    'xltx',
    'xltx.xltx',
    ',,,,,, Packing Slip ,Your Company Name,,,,"July 24, 2015", , Your Company Slogan,,,,, ,,,,,, ,Addres'
  );

  test(
    'ott',
    'ott.ott',
    'This is a document template, yay templates! Woo templates get me so excited!'
  );

  test(
    'ots',
    'ots.ots',
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
    'This is a drawing template A drawing template. Who would really ever need to extract from one of the'
  );

  test(
    'odp',
    'odp.odp',
    "This is a title This is a slide's text This is a 2nd page And a 2nd page's content"
  );

  test(
    'otp',
    'otp.otp',
    'This is a template title Template page text 2nd prezo text'
  );
});
