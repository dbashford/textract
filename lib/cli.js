var path = require('path');
    textract = require('./index')

var _writeHelp = function() {
  console.log("\n\nUsage: textract pathToFile\n\n")
}

var _textract = function( filePath ) {
  textract( filePath, function( error, text ) {
    if ( error ) {
      console.error(error)
    } else {
      console.log(text);
    }
  })
}

if (process.argv[2]) {
  var filePath = path.resolve(process.cwd(), process.argv[2])
  setTimeout(function(){_textract(filePath)}, 500)
} else {
  _writeHelp()
}