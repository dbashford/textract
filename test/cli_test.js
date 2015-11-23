var exec = require("child_process").exec
  , path = require("path")
  , cliPath = path.join(__dirname, "..", "bin", "textract")
  , testFilePath = path.join(__dirname, "files", "css.css")
  ;

describe("cli", function(){
  it("will extract text", function(done) {
    exec( cliPath + " " + testFilePath,
      function( error, stdout, stderr ) {
        expect(stdout).to.eql(".foo {color:red}\n");
        done();
      }
    );
  })
});

