var scrubPathName = function(filePath) {
  filePath = filePath.replace( /\(/g, '\\(' );
  filePath = filePath.replace( /\)/g, '\\)' );
  filePath = filePath.replace( / /g, '\\ ' );
  return filePath;
};

var createExecOptions = function(type, options) {
  var execOptions = {};
  if (options[type] && options[type].exec) {
    execOptions = options[type].exec;
  } else {
    if (options.exec) {
      execOptions = options.exec;
    }
  }
  return execOptions;
};

module.exports = {
  scrubPathName: scrubPathName,
  createExecOptions: createExecOptions
}