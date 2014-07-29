var exec = require( 'child_process' ).exec
    , path = require( 'path' );

var extractText = function( filePath, options, cb ) {
    var jBin = path.join( __dirname, '../../node_modules/j/bin/j.njs' ) + ' ' + filePath;
    exec(jBin, function ( error, stdout, stderr ) {
        if ( error !== null ) {
            error = new Error("Could not extract " + path.basename( filePath ) + ", " + error);
            cb( error, null );
            return;
        }

        cb( null, stdout );
    });
};

module.exports = {
    types: ["application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
        "application/vnd.ms-excel.sheet.macroEnabled.12"],
    extract: extractText
};