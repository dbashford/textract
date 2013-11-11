"use strict";

var exec = require('child_process').exec
  , xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

var extractText = function( filePath, options, cb ) {
  var error = null,
      MULTI_SPACES = /\s{2,}/g;

  filePath = filePath.replace( /\(/g, '\\(' );
  filePath = filePath.replace( /\)/g, '\\)' );
  filePath = filePath.replace( / /g, '\\ ' );

  var execOptions = {};
  if (options.xlsx && options.xlsx.exec) {
    execOptions = options.xlsx.exec;
  } else {
    if (options.exec) {
      execOptions = options.exec;
    }
  }

  exec( 'unzip -p ' + filePath + ' "*.xml"',
    execOptions,
    function ( error, stdout, stderr ) {
      if ( error !== null ) {
        error = new Error( "extractNewExcelDocument exec error: " + error );
        cb( error, null );
        return;
      }

      var doc = new dom().parseFromString(stdout);
      var textTags = xpath.select( "//*[local-name()='t' or local-name()='v']", doc );

      var textStrs = [];
      textTags.forEach(function (tag) {
        if ( tag.localName !== 'v' || tag.parentNode.getAttribute('t') !== 's' )	// ignore shared-string keys
          textStrs.push( tag.childNodes[0].data.trim() );
      });

      var text = textStrs.join( ', ' ).replace( MULTI_SPACES, ' ' );

      cb( null, text );
    }
  );
};

var testForBinary = function( cb ) {
  exec( "unzip",
    function( error, stdout, stderr ) {
      if ( error ) {
        console.error( "textract: 'unzip' does not appear to be installed, so it will be unable to extract XLSXs." );
      }
      cb( error === null );
    }
  );
};

module.exports = {
  types: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  extract: extractText,
  test: testForBinary
};
