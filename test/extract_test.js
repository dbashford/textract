/* eslint-disable max-len, no-unused-expressions */
/* global fromFileWithPath */

var path = require( 'path' );

describe( 'textract', function() {
  var test;

  describe( 'for .csv files ', function() {
    // is some oddness testing html files, not sure what the deal is

    it( 'from csv files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'csv.csv' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 18 );
        expect( text ).to.eql( 'Foo,Bar Foo2,Bar2 ' );
        done();
      });
    });

    it( 'it will extract text from csv files and insert newlines in the right places', function( done ) {
      var docPath = path.join( __dirname, 'files', 'csv.csv' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 18 );
        expect( text ).to.eql( 'Foo,Bar\nFoo2,Bar2\n' );
        done();
      });
    });
  });

  describe( 'for .html files', function() {
    // is some oddness testing html files, not sure what the deal is

    it( 'will extract text from html files and insert newlines in the right places', function( done ) {
      var docPath = path.join( __dirname, 'files', 'test.html' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 80 );
        expect( text.substring( 0, 80 ) ).to.eql( '\nThis is a\nlong string\nof text\nthat should get extracted\nwith new lines inserted' );
        done();
      });
    });


    it( 'will extract text from html files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'Google.html' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 869 );
        expect( text.substring( 565, 620 ) ).to.eql( 'you say next. Learn more No thanks Enable "Ok Google" I' );
        done();
      });
    });

    it( 'will extract text from html files and preserve alt text when asked', function( done ) {
      var docPath = path.join( __dirname, 'files', 'test-alt.html' );
      fromFileWithPath( docPath, { includeAltText: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 46 );
        expect( text ).to.eql( ' This is a paragraph that has an image inside ' );
        done();
      });
    });
  });

  describe( 'for .rss files', function() {
    it( 'will extract text from rss files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'rss.rss' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 5399 );
        expect( text.substring( 0, 100 ) ).to.eql( ' FeedForAll Sample Feed RSS is a fascinating technology. The uses for RSS are expanding daily. Take ' );
        done();
      });
    });

    it( 'will extract text from rss files and preserve line breaks', function( done ) {
      var docPath = path.join( __dirname, 'files', 'rss.rss' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 5534 );
        expect( text.substring( 0, 100 ) ).to.eql( '\n FeedForAll Sample Feed\n RSS is a fascinating technology. The uses for RSS are expanding daily. Tak' );
        done();
      });
    });
  });

  describe( 'for .epub files', function() {
    it( 'will extract text from epub files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'Metamorphosis-jackson.epub' );
      this.timeout( 5000 );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 119329 );
        expect( text.substring( 3000, 3500 ) ).to.eql( "dboard so that he could lift his head better; found where the itch was, and saw that it was covered with lots of little white spots which he didn't know what to make of; and when he tried to feel the place with one of his legs he drew it quickly back because as soon as he touched it he was overcome by a cold shudder. He slid back into his former position. \"Getting up early all the time\", he thought, \"it makes you stupid. You've got to get enough sleep. Other travelling salesmen live a life of lu" );
        done();
      });
    });

    it( 'will extract text from epub files and preserve line breaks', function( done ) {
      var docPath = path.join( __dirname, 'files', 'Metamorphosis-jackson.epub' );
      this.timeout( 5000 );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 119342 );
        expect( text.substring( 3000, 3500 ) ).to.eql( "rds the headboard so that he could lift his head better; found where the itch was, and saw that it was covered with lots of little white spots which he didn't know what to make of; and when he tried to feel the place with one of his legs he drew it quickly back because as soon as he touched it he was overcome by a cold shudder.\nHe slid back into his former position. \"Getting up early all the time\", he thought, \"it makes you stupid. You've got to get enough sleep. Other travelling salesmen live a" );
        done();
      });
    });
  });

  describe( 'for .atom files', function() {
    it( 'will extract text from atom files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'atom.atom' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 26731 );
        expect( text.substring( 0, 100 ) ).to.eql( ' @{}[]tag:theregister.co.uk,2005:feed/theregister.co.uk/data_centre/storage/ The Register - Data Cen' );
        done();
      });
    });

    it( 'will extract text from atom files and preserve line breaks', function( done ) {
      var docPath = path.join( __dirname, 'files', 'atom.atom' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 27441 );
        expect( text.substring( 0, 100 ) ).to.eql( '\n @{}[]tag:theregister.co.uk,2005:feed/theregister.co.uk/data_centre/storage/\n The Register - Data C' );
        done();
      });
    });
  });

  describe( 'for .rtf files', function() {
    it( 'will extract text from rtf files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'sample.rtf' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 144, 220 ) ).to.eql( "bit of hidden text. So we're going to end this paragraph here and go on to a" );
        done();
      });
    });

    it( 'will extract when there are spaces in the name', function( done ) {
      var docPath = path.join( __dirname, 'files', 'sample rtf.rtf' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 144, 220 ) ).to.eql( "bit of hidden text. So we're going to end this paragraph here and go on to a" );
        done();
      });
    });

    it( 'will extract text from actual rtf files with lines left in', function( done ) {
      var docPath = path.join( __dirname, 'files', 'sample.rtf' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 144, 230 ) ).to.eql( "bit of hidden text. So we're going to end this paragraph here and go on to a nice litt" );
        done();
      });
    });
  });

  describe( 'for .doc files', function() {
    it( 'will extract text from actual doc files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'doc.doc' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( ' Word Specification Sample Working Draft 04, 16 August 2002 Document identifier: wd-spectools-word-s' );
        done();
      });
    });

    it( 'will extract text from actual doc files with spaces in the name', function( done ) {
      var docPath = path.join( __dirname, 'files', 'doc space.doc' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( ' Word Specification Sample Working Draft 04, 16 August 2002 Document identifier: wd-spectools-word-s' );
        done();
      });
    });

    it( 'will not extract text from text files masquerading as doc files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'notadoc.doc' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( text ).to.be.null;
        expect( error.toString().indexOf( 'does not appear to really be a .doc file' ) ).to.eql( 36 );
        done();
      });
    });

    it( 'will extract text from large .doc', function( done ) {
      var docPath = path.join( __dirname, 'files', 'sample.doc' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.length ).to.eql( 32658 );
        done();
      });
    });

    it( 'will extract text preserving line breaks without word wrap', function( done ) {
      var docPath = path.join( __dirname, 'files', 'multiple-long-paragraphs.doc' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text.match( /\r\n|\n/g ).length ).to.eql( 21 );
        done();
      });
    });
  });

  describe( 'for .xls files', function() {
    it( 'will extract text', function( done ) {
      var docPath = path.join( __dirname, 'files', 'test.xls' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 20 ) ).to.eql( 'This,is,a,spreadshee' );
        done();
      });
    });

    it( 'will extract text from multi-line files', function( done ) {
      var docPath = path.join( __dirname, 'files', 'test-multiline.xls' );
      fromFileWithPath( docPath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 40 ) ).to.eql( 'This,is,a,spreadsheet,yay! And ,this,is,' );
        done();
      });
    });

    it( 'will extract text from multi-line files and keep line breaks', function( done ) {
      var docPath = path.join( __dirname, 'files', 'test-multiline.xls' );
      fromFileWithPath( docPath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 40 ) ).to.eql( 'This,is,a,spreadsheet,yay!\nAnd ,this,is,' );
        done();
      });
    });
  });

  describe( 'for .xlsx files', function() {
    it( 'will extract text and numbers from XLSX files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'pi.xlsx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text ).to.eql( 'This is the value of PI:,3.141592 ' );
        done();
      });
    });

    it( 'will extract text from XLSX files with multiple sheets', function( done ) {
      var filePath = path.join( __dirname, 'files', 'xlsx.xlsx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 49, 96 ) ).to.eql( 'Color,Pattern,Sex,GeneralSizePotential,GeneralA' );
        done();
      });
    });

    it( 'will error when input file is not an actual xlsx file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'notaxlsx.xlsx' );
      fromFileWithPath( filePath, function( error ) {
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.a( 'string' );
        expect( error.message.substring( 0, 43 ) ).to.eql( 'Could not extract notaxlsx.xlsx, Error: PRN' );
        done();
      });
    });
  });

  describe( 'for .pdf files', function() {
    it( 'will extract text from actual pdf files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'pdf.pdf' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This is a test. Please ignore.' );
        done();
      });
    });

    it( 'will extract pdf text and preserve multiple lines', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testpdf-multiline.pdf' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This is a test,\nA multi-line test,\nLets hope it works' );
        done();
      });
    });

    it( 'will error out when pdf file isn\'t actually a pdf', function( done ) {
      var filePath = path.join( __dirname, 'files', 'notapdf.pdf' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( text ).to.be.null;
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.a( 'string' );
        expect( error.message.substring( 0, 34 ) ).to.eql( 'Error extracting PDF text for file' );
        done();
      });
    });

    it( 'will properly handle multiple columns', function( done ) {
      var filePath = path.join( __dirname, 'files', 'two_columns.pdf' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.indexOf(
          'Abstract— This work deals with a multi-cell topology based\non current-source converters based power cells.'
        ) > 500 ).to.be.true;
        done();
      });
    });

    it( 'can handle files with spaces in the name', function( done ) {
      var filePath = path.join( __dirname, 'files', 'two columns.pdf' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.indexOf(
          'Abstract— This work deals with a multi-cell topology based\non current-source converters based power cells.'
        ) > 500 ).to.be.true;
        done();
      });
    });

    it( 'can handle manage PDFs with passwords', function( done ) {
      var filePath = path.join( __dirname, 'files', 'pdf-example-password.original.pdf' );
      fromFileWithPath( filePath, { pdftotextOptions: { userPassword: 'test' } }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 200 ) ).to.eql( 'Backup4all –backup solution for network environments Starting from version 2 it is easier to install Backup4all in a network environment. Network administrators can install Backup4all on a single comp' );
        done();
      });
    });

    it( 'can handle manage PDFS with full-width Japanese characters', function( done ) {
      var filePath = path.join( __dirname, 'files', 'full-width-j.pdf' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.replace( / /g, '' ).substring( 2685, 2900 ) ).to.eql( '＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～｟｠｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟﾡﾢﾣﾤﾥﾦﾧﾨﾩﾪﾫﾬﾭﾮﾯﾰﾱﾲﾳﾴﾵﾶﾷﾸﾹﾺﾻﾼﾽﾾￂￃￄￅￆￇￊￋￌￍￎￏￒￓￔￕￖￗￚￛￜ￠￡￢￣￤￥￦F' );
        done();
      });
    });

    // it( 'can handle arabic', function( done ) {
    //   var filePath = path.join( __dirname, 'files', 'arabic.pdf' );
    //   fromFileWithPath( filePath, function( error, text ) {
    //     expect( error ).to.be.null;
    //     expect( text ).to.be.a( 'string' );
    //     expect( text.substring( 0, 200 ) ).to.eql( '' );
    //     done();
    //   });
    // });
  });

  describe( 'for .docx files', function() {
    it( 'will extract text from actual docx files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'docx.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 20 ) ).to.eql( 'This is a test Just ' );
        done();
      });
    });

    it( 'will extract text from actual docx files and preserve line breaks', function( done ) {
      var filePath = path.join( __dirname, 'files', 'docx.docx' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 20, 40 ) ).to.eql( 'so you know:\nLorem i' );
        done();
      });
    });

    it( 'will extract text from actual docx files and preserve line breaks [line-breaks.docx]', function( done ) {
      var filePath = path.join( __dirname, 'files', 'line-breaks.docx' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'Paragraph follows\n\nLine break follows\n\nend\n\n' );
        done();
      });
    });

    it( 'will error out when docx file isn\'t actually a docx', function( done ) {
      var filePath = path.join( __dirname, 'files', 'notadocx.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( text ).to.be.null;
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.a( 'string' );
        expect( error.message.substring( 0, 34 ) ).to.eql( 'File not correctly recognized as z' );
        done();
      });
    });

    it( 'will not extract smashed together text', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testresume.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 31 ) ).to.eql( 'Karol Miner 336 W. Chugalug Way' );
        done();
      });
    });

    it( 'can handle funky formatting', function( done ) {
      var filePath = path.join( __dirname, 'files', 'Untitleddocument.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( "this is a test document that won't be extracted properly. " );
        done();
      });
    });

    it( 'can handle a huge docx', function( done ) {
      var filePath = path.join( __dirname, 'files', 'LargeLorem.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( 'Hashtag chambray XOXO PBR&B chia small batch. Before they sold out banh mi raw denim, fap synth hell' );
        done();
      });
    });

    it( 'can handle arabic', function( done ) {
      var filePath = path.join( __dirname, 'files', 'arabic.docx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( ' التعرف الضوئي على الحروف إشعار عدم التمييز (المصدر: مكتب الصحة والخدمات الإنسانية من أجل الحقوق الم' );
        done();
      });
    });
  });

  describe( 'for text/* files', function() {
    it( 'will extract text from specifically a .txt file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'txt.txt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'This is a plain old text file.' );
        done();
      });
    });

    it( 'will extract text from specifically a non utf8 .txt file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'non-utf8.txt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'これは非UTF8 テキストファイルです ' );
        done();
      });
    });

    it( 'will error when .txt file encoding cannot be detected', function( done ) {
      var filePath = path.join( __dirname, 'files', 'unknown-encoding.txt' );
      fromFileWithPath( filePath, function( error ) {
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.a( 'string' );
        expect( error.message ).to.eql( 'Could not detect encoding for file named [[ unknown-encoding.txt ]]' );
        done();
      });
    });

    it( 'will extract text specifically from a .css file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'css.css' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( '.foo {color:red}' );
        done();
      });
    });

    it( 'will extract text specifically from a .js file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'js.js' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'console.log("javascript is cooler than you")' );
        done();
      });
    });

    it( 'will remove extraneous white space from a .txt file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'spacey.txt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'this has lots of space' );
        done();
      });
    });

    it( 'will not remove fancy quotes from a .txt file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'fancyquote.txt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.a( 'string' );
        expect( text ).to.eql( 'this has "fancy" quotes' );
        done();
      });
    });
  });

  describe( 'for .dxf files', function() {
    it( 'will extract text from actual dxf files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'dxf.dxf' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        // eslint-disable-next-line no-useless-escape
        expect( text ).to.eql( ' PART: FILE: {\fTimes New Roman|b0|i0|c0|p18;(800) 433-1119} {\fTimes New Roman|b0|i0|c0|p18;Barium Springs, NC 28010} {\fTimes New Roman|b0|i0|c0|p18;MultiDrain Systems, Inc.} {\fTimes New Roman|b0|i0|c0|p18;Manufacturers of MultiDrain & EconoDrain } to others for manufacturing or for any other purpose except as specifically authorized in writing by MultiDrain Systems, Inc. Proprietary rights of MultiDrain Systems, Inc. are included in the information disclosed herein. The recipient, by accepting this document, agrees that neither this document nor the information disclosed herein nor any part thereof shall be copied, reproduced or transferred 0 2" 4" 6" 8" 12" 16" GRAPHIC SCALE BAR \A1;T \A1;T \A1;T \A1;6.1" 155mm \A1;T \A1;T \A1;4.9" 124mm \A1;19.6" 497mm FRAME AND GRATE LENGTH \A1;5.5" 140mm %%UCROSS SECTIONAL VIEW SOIL SUBGRADE CONCRETE THICKNESS AND REINFORCEMENT PER STRUCTURAL ENGINEER S SPECIFICATION FOR THE APPLICATION FLOOR SLAB THICKNESS, OR 4" MIN. [100mm], OR SPECIFICATION (WHICHEVER IS GREATER) T = MONOLITHIC CONCRETE POUR (ACCEPTABLE) EXPANSION JOINT BOTH SIDES (PREFERRED) LOCK DOWN BOLT LOCK TOGGLE ANCHOR BOLT SEE ABOVE FOR ACTUAL FRAME & GRATE SECTIONS %%UPLAN %%USECTION 512AF %%UPLAN %%USECTION 513AF 514AF %%UPLAN %%USECTION 515AF %%UPLAN %%USECTION ANCHOR RIB INDEPENDENTLY ANCHORED FRAME ALFA CHANNEL \A1;502 GRATE 510AF ANCHOR FRAME 503 GRATE 510AF ANCHOR FRAME 504 GRATE 505 GRATE FRAME AND GRATE ADD 1.2" [31mm] TO OVERALL DEPTH OF CHANNEL \LNOTE: GRATE WIDTH FRAME WIDTH AC-2510AF-00 2512AF 2513AF 2514AF 2515AF ALFA CHANNEL SYSTEM DUCTILE IRON FRAME & GRATES PRODUCT DRAWING 2006 MultiDrain Systems, Inc. ' );
        done();
      });
    });

    it( 'will error when input file is not an actual dxf file', function( done ) {
      var filePath = path.join( __dirname, 'files', 'notadxf.dxf' );
      fromFileWithPath( filePath, function( error ) {
        expect( error ).to.be.an( 'object' );
        expect( error.message ).to.be.a( 'string' );
        expect( error.message.substring( 0, 40 ) ).to.eql( 'Error for type: [[ image/vnd.dxf ]], fil' );
        done();
      });
    });
  });

  describe( 'for .pptx files', function() {
    it( 'will extract text PPTX files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'ppt.pptx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 55, 96 ) ).to.eql( 'ullet 1 Bullet 2 Bullet 3 Number 1 Number' );
        done();
      });
    });

    it( 'will extract text PPTX files with notes', function( done ) {
      var filePath = path.join( __dirname, 'files', 'PrezoWithNotes.pptx' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text).to.eql( 'This is a slide These are speaker notes 1 ' );
        done();
      });
    });

    it( 'will extract slides in the right order', function( done ) {
      var filePath = path.join( __dirname, 'files', 'order.pptx' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        var lines, linesAnswer;
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        lines = text.split( '\n' ).filter( function( line ) {
          return line.match( /^Slide/ );
        });

        linesAnswer = [
          'Slide 1 Title',
          'Slide 1 Subtitle',
          'Slide 2: Title and Content',
          'Slide 3: Section header',
          'Slide 4: Two-Content',
          'Slide 5: Comparison',
          'Slide 8: Content w/Caption',
          'Slide 9: picture with caption',
          'Slide 10: Vertical Text',
          'Slide 11: Vertical Title and text'];

        expect( lines ).to.eql( linesAnswer );

        done();
      });
    });

    it( 'will keep preserved characters', function( done ) {
      var filePath = path.join( __dirname, 'files', 'order.pptx' );
      fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.indexOf( '…' ) ).to.eql( 928 );
        done();
      });
    });
  });

  describe( 'for odt files', function() {
    it( 'will extract text from ODT files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'spaced.odt' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text ).to.eql( 'This Is some text' );
        done();
      });
    });
  });

  describe( 'for image files', function() {
    it( 'will extract text from PNG files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testphoto.png' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( 'performance measure against standards and targets is increasingly used in the management of complex ' );
        done();
      });
    });

    it( 'will extract text from JPG files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testphoto.jpg' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( 'performance measure against standards and targets is increasingly used in the management of complex ' );
        done();
      });
    });

    it( 'will extract text from GIF files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testphoto.gif' );
      fromFileWithPath( filePath, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( 'performance measure against standards and targets is increasingly used in the management of complex ' );
        done();
      });
    });

    // sudo port install tesseract-chi-sim
    it( 'will extract text from language-d files', function( done ) {
      var filePath = path.join( __dirname, 'files', 'chi.png' );
      this.timeout( 5000 );
      fromFileWithPath( filePath, { tesseract: { lang: 'chi_sim' } }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 6 ) ).to.eql( '卧虎藏龙，卧' );
        done();
      });
    });

    // sudo port install tesseract-eng
    it( 'will take tesseract.cmd option', function( done ) {
      var filePath = path.join( __dirname, 'files', 'testpng.png' );
      this.timeout( 5000 );
      fromFileWithPath( filePath, { tesseract: { cmd: '-l eng -psm 3' } }, function( error, text ) {
        expect( error ).to.be.null;
        expect( text ).to.be.an( 'string' );
        expect( text.substring( 0, 100 ) ).to.eql( 'The (quick) [brown] {fox} jumps! Over the $43,456.78 <lazy> #90 dog & duck/goose, as 12.5% of E-mail' );
        done();
      });
    });
  });

  test = function( ext, name, text1, text2 ) {
    describe( 'for ' + ext + ' files', function() {
      it( 'will extract text', function( done ) {
        var filePath = path.join( __dirname, 'files', name );
        fromFileWithPath( filePath, function( error, text ) {
          expect( error ).to.be.null;
          expect( text ).to.be.an( 'string' );
          expect( text.substring( 0, 100 ) ).to.eql( text1 );
          done();
        });
      });

      it( 'will extract text and preserve line breaks', function( done ) {
        var filePath = path.join( __dirname, 'files', name );
        fromFileWithPath( filePath, { preserveLineBreaks: true }, function( error, text ) {
          expect( error ).to.be.null;
          expect( text ).to.be.an( 'string' );
          expect( text.substring( 0, 100 ) ).to.eql( text2 );
          done();
        });
      });
    });
  };

  test(
    'markdown',
    'test.md',
    ' This is an h1 This is an h2 This text has been bolded and italicized ',
    '\nThis is an h1\nThis is an h2\nThis text has been bolded and italicized\n'
  );

  test(
    'ods',
    'ods.ods',
    'This,is,a,ods Really,it,is, I,promise,, ',
    'This,is,a,ods\nReally,it,is,\nI,promise,,\n'
  );

  test(
    'xml',
    'xml.xml',
    ' Empire Burlesque Bob Dylan USA Columbia 10.90 1985 Hide your heart Bonnie Tyler UK CBS Records 9.90',
    '\nEmpire Burlesque\nBob Dylan\nUSA\nColumbia\n10.90\n1985\nHide your heart\nBonnie Tyler\nUK\nCBS Records\n9.90'
  );

  test(
    'odt',
    'odt.odt',
    'This is an ODT THIS IS A HEADING More ODT',
    'This is an ODT\nTHIS IS A HEADING\nMore ODT'
  );

  test(
    'potx',
    'potx.potx',
    'This is a potx template Yep, a potx I had no idea These were even a thing ',
    'This is a potx template\nYep, a potx\nI had no idea \nThese were even a thing\n'
  );

  test(
    'xltx',
    'xltx.xltx',
    ',,,,,, Packing Slip ,Your Company Name,,,,"July 24, 2015", , Your Company Slogan,,,,, ,,,,,, ,Addres',
    ',,,,,, Packing Slip\n,Your Company Name,,,,"July 24, 2015",\n, Your Company Slogan,,,,,\n,,,,,,\n,Addres'
  );

  test(
    'ott',
    'ott.ott',
    'This is a document template, yay templates! Woo templates get me so excited!',
    'This is a document template, yay templates!\nWoo templates get me so excited!'
  );

  test(
    'ots',
    'ots.ots',
    "This,is , template, an,open,office,template isn't,it,awesome?, you,know,it,is ",
    "This,is , template,\nan,open,office,template\nisn't,it,awesome?,\nyou,know,it,is\n"
  );

  test(
    'odg',
    'odg.odg',
    "This is a drawing? A drawing, a drawing! This is a drawing, Aren't you mad envious?",
    "This is a drawing?\nA drawing, a drawing!\nThis is a drawing,\nAren't you mad envious?"
  );

  test(
    'otg',
    'otg.otg',
    'This is a drawing template A drawing template. Who would really ever need to extract from one of the',
    'This is a drawing template\nA drawing template.\nWho would really ever need to extract from one of the'
  );

  test(
    'odp',
    'odp.odp',
    "This is a title This is a slide's text This is a 2nd page And a 2nd page's content",
    "This is a title\nThis is a slide's text\nThis is a 2nd page\nAnd a 2nd page's content"
  );

  test(
    'otp',
    'otp.otp',
    'This is a template title Template page text 2nd prezo text',
    'This is a template title\nTemplate page text\n2nd prezo text'
  );
});
