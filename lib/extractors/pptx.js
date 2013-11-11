"use strict";

var exec = require('child_process').exec
  , xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

var extractText = function( filePath, options, cb ) {
  var result = ''
    , error = null
    , SINGLE_QUOTES = /[\u2018|\u2019]/g
    , DOUBLE_QUOTES = /[\u201C|\u201D]/g
    , MULTI_SPACES = /\s{2,}/g
    , NON_ASCII_CHARS = /[^\x00-\x7F]/g;

  filePath = filePath.replace( /\(/g, '\\(' );
  filePath = filePath.replace( /\)/g, '\\)' );
  filePath = filePath.replace( / /g, '\\ ' );

  var execOptions = {};
  if (options.pptx && options.pptx.exec) {
    execOptions = options.pptx.exec;
  } else {
    if (options.exec) {
      execOptions = options.exec;
    }
  }

  exec( "unzip -c " + filePath + " ppt/slides/*.xml",
    execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "extract powerpoint, pptx, exec error: " + error );
        cb( error, null );
        return;
      }

      // slides are often out of order, need to reorder
      var outArray = [];
      var slides = stdout.split( "inflating: ppt/slides/slide" );
      for ( var i = 1; i <= slides.length; i++ ) {
        var slideNum = i+"";
        slides.forEach( function( slide ) {
          if ( slide.charAt(0) === slideNum ) {
            outArray.push( slide );
          }
        });
      }
      var arrangedPages = outArray.join( "inflating: ppt/slides/slide" );

      var doc = new dom().parseFromString( arrangedPages );
      var ps = xpath.select( "//*[local-name()='p']", doc );
      var text = "";

      ps.forEach( function ( paragraph ) {
        paragraph = new dom().parseFromString( paragraph.toString() );
        var ts = xpath.select( "//*[local-name()='t' or local-name()='tab' or local-name()='br']", paragraph );
        var localText = "";
        ts.forEach( function ( t ) {
          if ( t.localName === "t" ) {
            localText += t.childNodes[0].data;
          } else {
            if ( t.localName === "tab" || t.localName === "br" ) {
              localText += "";
            }
          }
        });
        text += localText + "\n";
      });

      text = text.trim()
        .replace( SINGLE_QUOTES, "'" )
        .replace( DOUBLE_QUOTES, '"' )
        .replace( NON_ASCII_CHARS, '' )
        .replace( MULTI_SPACES, ' ' );

      cb( null, text );
    }
  );
};

var testForBinary = function( cb ) {
  exec( "unzip",
    function( error, stdout, stderr ) {
      if ( error ) {
        console.error( "textract: 'unzip' does not appear to be installed, so textract will be unable to extract PDFXs." );
      }
      cb( error === null );
    }
  );
};

module.exports = {
  types: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  extract: extractText,
  test: testForBinary
};
