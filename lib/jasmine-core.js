module.exports = require('./jasmine-core/jasmine')
module.exports.boot = require('./jasmine-core/node_boot')

const path = require('path')
const fs = require('fs')

const rootPath = path.join(__dirname, 'jasmine-core')
const bootFiles = ['boot.js']
const nodeBootFiles = ['node_boot.js']
let cssFiles = []
let jsFiles = []
const jsFilesToSkip = ['jasmine.js'].concat(bootFiles, nodeBootFiles)

fs.readdirSync(rootPath).forEach((file) => {
  if (fs.statSync(path.join(rootPath, file)).isFile()) {
    switch (path.extname(file)) {
      case '.css':
        cssFiles.push(file)
        break
      case '.js':
        if (jsFilesToSkip.indexOf(file) < 0) {
          jsFiles.push(file)
        }
        break;
    }
  }
})

module.exports.files = {
  path: rootPath,
  bootDir: rootPath,
  bootFiles: bootFiles,
  nodeBootFiles: nodeBootFiles,
  cssFiles: cssFiles,
  jsFiles: ['jasmine.js'].concat(jsFiles),
  imagesDir: path.join(__dirname, '../images'),
}
