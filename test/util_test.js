var util = require('../lib/util');

describe('textract util', function() {

  it('should normalize text output', function() {
    var text = "    “” ‘’ ą  \n\n some text";
    var result = util.replaceTextChars(text);
    expect(result).to.equal("\"\" '' ą \n\n some text");
  });

});
