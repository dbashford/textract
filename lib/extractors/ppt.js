var fs = require( 'fs' );
  //, ppt = require( 'ppt' );

var extractText = function( filePath, options, cb ) {
  /*
  var captured = ppt.readFile(filePath);
  console.log("CAPTURED!!!!")
  console.log(captured)
  console.log("CAPTURED!!!!")
  cb( null, null );
    if ( error ) {
      cb( error, null );
      return;
    }
    cb( null, data.toString() );
  */
};

module.exports = {
  // types: ["application/vnd.ms-powerpoint"],
  types:[],
  extract: extractText
};