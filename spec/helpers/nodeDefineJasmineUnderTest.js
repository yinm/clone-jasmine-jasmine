(function() {
  const path = require('path')
  const fs = require('fs')
  const glob = require('glob')

  const jasmineUnderTestRequire = require(path.join(__dirname, '../../src/core/requireCore.js'))

  global.getJasmineRequireObj = () => {
    return jasmineUnderTestRequire
  }

  function extend(destination, source) {
    for (let property in source) destination[property] = source[property]
    return destination
  }

  function getSourceFiles() {
    let src_files = ['core/**/*.js', 'version.js']
    src_files.forEach((file) => {
      const filePath = path.join(__dirname, '../../', 'src/', file)
      glob.sync(filePath).forEach((resolvedFile) => {
        require(resolvedFile)
      })
    })
  }

  getSourceFiles()
  global.jasmineUnderTest = jasmineUnderTestRequire.core(jasmineUnderTestRequire)
})()
