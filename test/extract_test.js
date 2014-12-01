var path = require('path');

describe('textract', function() {


  describe('for .html files', function() {

    // is some oddness testing html files, not sure what the deal is

    it('will extract text from html files and insert newlines in the right places', function(done) {
      var docPath = path.join( __dirname, "files", "test.html" );
      textract(docPath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.length).to.eql( 80 );
        expect(text.substring(0, 80)).to.eql("\nThis is a\nlong string\nof text\nthat should get extracted\nwith new lines inserted")
        done();
      });
    });


    it('will extract text from html files', function(done) {
      var docPath = path.join( __dirname, "files", "Google.html" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.length).to.eql( 869 );
        expect(text.substring(565, 620)).to.eql("you say next. Learn more No thanks Enable \"Ok Google\" I")
        done();
      });
    });
  });


  describe('for .rtf files', function() {
    it('will extract text from rtf files', function(done) {
      var docPath = path.join( __dirname, "files", "sample.rtf" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(144,220)).to.eql( "So we're going to end this paragraph here and go on to a nice little list: I" );
        done();
      });
    });

    it('will extract text from actual rtf files with lines left in', function(done) {
      var docPath = path.join( __dirname, "files", "sample.rtf" );
      textract(docPath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(144,230)).to.eql( "So we're going to end this paragraph here and go on to a nice little list:\n\n Item 1\n I" );
        done();
      });
    });
  });

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

    it('will extract text from large .doc', function(done) {
      var docPath = path.join( __dirname, "files", "sample.doc" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.length).to.eql( 32398 );
        done();
      });
    });
  });

  describe('for .xls files', function() {

    it('will extract text', function(done) {
      var docPath = path.join( __dirname, "files", "test.xls" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,20)).to.eql( "This,is,a,spreadshee" );
        done();
      });
    });

    it('will extract text from multi-line files', function(done) {
      var docPath = path.join( __dirname, "files", "test-multiline.xls" );
      textract(docPath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,40)).to.eql( "This,is,a,spreadsheet,yay! And ,this,is," );
        done();
      });
    });

    it('will extract text from multi-line files and keep line breaks', function(done) {
      var docPath = path.join( __dirname, "files", "test-multiline.xls" );
      textract(docPath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(0,40)).to.eql( "This,is,a,spreadsheet,yay!\nAnd ,this,is," );
        done();
      });
    });
  });

  describe('for .xlsx files', function() {
    it('will extract text and numbers from XLSX files', function(done) {
      var filePath = path.join( __dirname, "files", "pi.xlsx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql('This is the value of PI:,3.141592 ');
        done();
      });
    });

    it('will extract text from XLSX files with multiple sheets', function(done) {
      var filePath = path.join( __dirname, "files", "xlsx.xlsx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(49,96)).to.eql("Color,Pattern,Sex,GeneralSizePotential,GeneralA");
        done();
      });
    });

    it('will error when input file is not an actual xlsx file', function(done) {
      var filePath = path.join( __dirname, "files", "notaxlsx.xlsx" );
      textract(filePath, function( error ) {
        expect(error).to.be.an('object');
        expect(error.message).to.be.a('string');
        expect(error.message.substring(0,41)).to.eql("Could not extract notaxlsx.xlsx, Error: C");
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

    it('will extract pdf text and preserve multiple lines', function(done) {
      var filePath = path.join( __dirname, "files", "testpdf-multiline.pdf" );
      textract(filePath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "This is a test,\nA multi-line test,\nLets hope it works" );
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

    it('will extract text from actual docx files and preserve line breaks', function(done) {
      var filePath = path.join( __dirname, "files", "docx.docx" );
      textract(filePath, {preserveLineBreaks:true}, function( error, text ) {
        //console.log(text)
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text.substring(20,40)).to.eql( "so you know:\nLorem i" );
        done();
      });
    });

    it('will error out when docx file isn\'t actually a docx', function(done) {
      var filePath = path.join( __dirname, "files", "notadocx.docx" );
      textract(filePath, function( error, text ) {
        expect(text).to.be.null;
        expect(error).to.be.an('object');
        expect(error.message).to.be.a('string');
        expect(error.message.substring(0,34)).to.eql("extractNewWordDocument exec error:");
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

    it('can handle funky formatting', function(done) {
      var filePath = path.join( __dirname, "files", "Untitleddocument.docx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.a('string');
        expect(text).to.eql( "this is a test document that won't be extracted properly." );
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

  describe('for .dxf files', function() {
    it('will extract text from actual dxf files', function(done) {
      var filePath = path.join( __dirname, "files", "dxf.dxf" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text).to.eql( " PART: FILE: {\fTimes New Roman|b0|i0|c0|p18;(800) 433-1119} {\fTimes New Roman|b0|i0|c0|p18;Barium Springs, NC 28010} {\fTimes New Roman|b0|i0|c0|p18;MultiDrain Systems, Inc.} {\fTimes New Roman|b0|i0|c0|p18;Manufacturers of MultiDrain & EconoDrain } to others for manufacturing or for any other purpose except as specifically authorized in writing by MultiDrain Systems, Inc. Proprietary rights of MultiDrain Systems, Inc. are included in the information disclosed herein. The recipient, by accepting this document, agrees that neither this document nor the information disclosed herein nor any part thereof shall be copied, reproduced or transferred 0 2\" 4\" 6\" 8\" 12\" 16\" GRAPHIC SCALE BAR \A1;T \A1;T \A1;T \A1;6.1\" 155mm \A1;T \A1;T \A1;4.9\" 124mm \A1;19.6\" 497mm FRAME AND GRATE LENGTH \A1;5.5\" 140mm %%UCROSS SECTIONAL VIEW SOIL SUBGRADE CONCRETE THICKNESS AND REINFORCEMENT PER STRUCTURAL ENGINEER S SPECIFICATION FOR THE APPLICATION FLOOR SLAB THICKNESS, OR 4\" MIN. [100mm], OR SPECIFICATION (WHICHEVER IS GREATER) T = MONOLITHIC CONCRETE POUR (ACCEPTABLE) EXPANSION JOINT BOTH SIDES (PREFERRED) LOCK DOWN BOLT LOCK TOGGLE ANCHOR BOLT SEE ABOVE FOR ACTUAL FRAME & GRATE SECTIONS %%UPLAN %%USECTION 512AF %%UPLAN %%USECTION 513AF 514AF %%UPLAN %%USECTION 515AF %%UPLAN %%USECTION ANCHOR RIB INDEPENDENTLY ANCHORED FRAME ALFA CHANNEL \A1;502 GRATE 510AF ANCHOR FRAME 503 GRATE 510AF ANCHOR FRAME 504 GRATE 505 GRATE FRAME AND GRATE ADD 1.2\" [31mm] TO OVERALL DEPTH OF CHANNEL \LNOTE: GRATE WIDTH FRAME WIDTH AC-2510AF-00 2512AF 2513AF 2514AF 2515AF ALFA CHANNEL SYSTEM DUCTILE IRON FRAME & GRATES PRODUCT DRAWING 2006 MultiDrain Systems, Inc. ");
        done();
      });
    });

    it('will error when input file is not an actual dxf file', function(done) {
      var filePath = path.join( __dirname, "files", "notadxf.dxf" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.an('object');
        expect(error.message).to.be.a('string');
        expect(error.message.substring(0,20)).to.eql( "error extracting DXF");
        done();
      });
    });
  });

  describe('for .pptx files', function() {
    it('will extract text PPTX files', function(done) {
      var filePath = path.join( __dirname, "files", "ppt.pptx" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(55,96)).to.eql('ullet 1 Bullet 2 Bullet 3 Number 1 Number');
        done();
      });
    });

    it('will extract slides in the right order', function(done) {
      var filePath = path.join( __dirname, "files", "order.pptx" );
      textract(filePath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        var lines = text.split("\n").filter( function( line ) {
          return line.match(/^Slide/);
        });

        var linesAnswer = [
          'Slide 1 Title',
          'Slide 1 Subtitle',
          'Slide 2: Title and Content',
          'Slide 3: Section header',
          'Slide 4: Two-Content',
          'Slide 5: Comparison',
          'Slide 8: Content w/Caption',
          'Slide 9: picture with caption',
          'Slide 10: Vertical Text',
          'Slide 11: Vertical Title and text' ];

        expect(lines).to.eql(linesAnswer)

        done();
      });
    });


    it('will keep preserved characters', function(done) {
      var filePath = path.join( __dirname, "files", "order.pptx" );
      textract(filePath, {preserveLineBreaks:true}, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.indexOf("…")).to.eql(928);
        done();
      });
    });


  });

  describe('for image files', function() {
    it('will extract text from PNG files', function(done) {
      var filePath = path.join( __dirname, "files", "testphoto.png" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,100)).to.eql("performance measure against standards and targets is increasingly used in the management of complex ");
        done();
      });
    });

    it('will extract text from JPG files', function(done) {
      var filePath = path.join( __dirname, "files", "testphoto.jpg" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,100)).to.eql("performance measure against standards and targets is increasingly used in the management of complex ");
        done();
      });
    });

    it('will extract text from GIF files', function(done) {
      var filePath = path.join( __dirname, "files", "testphoto.gif" );
      textract(filePath, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,100)).to.eql("performance measure against standards and targets is increasingly used in the management of complex ");
        done();
      });
    });

    // sudo port install tesseract-chi-sim
    it('will extract text from language-d files', function(done) {
      var filePath = path.join( __dirname, "files", "chi.png" );
      textract(filePath, { tesseract: { lang:"chi_sim" } }, function( error, text ) {
        expect(error).to.be.null;
        expect(text).to.be.an('string');
        expect(text.substring(0,5)).to.eql("臣卜虎藏龙");
        done();
      });
    });
  });
});
