"use strict";

var xpath = require('xpath')
  , dom = require('xmldom').DOMParser
  , yauzl = require('yauzl')
  , util = require('../util')
  , slideMatch = /^ppt\/slides\/slide/
  ;

var _compareSlides = function(a, b) {
  if (a.slide < b.slide) {
    return -1;
  }
  if (a.slide > b.slide) {
    return 1;
  }
  return 0;
};

var _calculateExtractedText = function(slideText) {
  var doc = new dom().parseFromString( slideText );
  var ps = xpath.select( "//*[local-name()='p']", doc );
  var text = "";

  ps.forEach( function ( paragraph ) {
    paragraph = new dom().parseFromString( paragraph.toString() );
    var ts = xpath.select( "//*[local-name()='t' or local-name()='tab' or local-name()='br']", paragraph );
    var localText = "";
    ts.forEach( function ( t ) {
      if ( t.localName === "t" && t.childNodes.length > 0 ) {
        localText += t.childNodes[0].data;
      } else {
        if ( t.localName === "tab" || t.localName === "br" ) {
          localText += "";
        }
      }
    });
    text += localText + "\n";
  });

  return text;

};

var extractText = function( filePath, options, cb ) {
  var slides = [];

  yauzl.open( filePath, function( err, zipfile ) {
    if ( err ) {
      util.yauzlError( err, cb );
      return;
    }

    zipfile.on( "end", function() {
      if ( slides.length ) {
        slides.sort( _compareSlides );
        var slidesText = slides.map( function( slide ) {
          return slide.text;
        }).join( "\n" );
        var text = _calculateExtractedText( slidesText );
        cb( null, text );
      } else {
        cb(
          new Error("Extraction could not find slides in file, are you sure it is the mime type it says it is?"),
          null);
      }
    });

    zipfile.on( "entry", function( entry) {
      if ( slideMatch.test( entry.fileName ) )  {
        util.getTextFromZipFile( zipfile, entry, function( err, text ) {
          var slide = +entry.fileName.replace("ppt/slides/slide", "").replace(".xml", "");
          slides.push({slide:slide, text: text});
        });
      }
    });
  });
};

module.exports = {
  types: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.template"],
  extract: extractText
};
