exports.config =
  modules: ['jshint']
  watch:
    sourceDir: "lib"
    compiledDir: "ignore"
    javascriptDir: null
  jshint:
    rules:
      node: true
      laxcomma: true