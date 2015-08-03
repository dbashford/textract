exports.config =
  modules: ['copy', 'jshint']
  watch:
    sourceDir: "lib"
    compiledDir: "ignore"
    javascriptDir: null
  jshint:
    rules:
      node: true
      laxcomma: true