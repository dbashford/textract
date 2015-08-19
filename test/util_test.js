var util = require('../lib/util');

describe('textract util', function() {

  it('should normalize text output', function() {
    var text = "    “” ‘’ ą  \n\n some text";
    var result = util.replaceTextChars(text);
    expect(result).to.equal("\"\" '' \n\n some text");
  });

});
