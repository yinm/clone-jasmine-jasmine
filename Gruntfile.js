module.exports = function(grunt) {
  var pkg = require("./package.json");
  global.jasmineVersion = pkg.version;

  grunt.initConfig({
    pkg: pkg,
    concat: require('./grunt/config/concat.js'),
    compass: require('./grunt/config/compass.js'),
    compress: require('./grunt/config/compress.js')
  });

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('grunt/tasks');


  var version = require('./grunt/tasks/version.js');

  grunt.registerTask('build:copyVersionToGem',
    "Propagates the version from package.json to version.rb",
    version.copyToGem);

  grunt.registerTask('buildDistribution',
    'Builds and lints jasmine.js, jasmine-html.js, jasmine.css',
    [
      'compass',
      'concat',
      'build:copyVersionToGem'
    ]
  );

  grunt.registerTask("execSpecsInNode",
    "Run Jasmine core specs in Node.js",
    function() {
      var done = this.async(),
          Jasmine = require('jasmine'),
          jasmineCore = require('./lib/jasmine-core.js'),
          jasmine = new Jasmine({jasmineCore: jasmineCore});

      jasmine.loadConfigFile('./spec/support/jasmine.json');
      jasmine.onComplete(function(passed) {
        done(passed);
      });

      jasmine.execute();
    }
  );

  grunt.registerTask("execSpecsInNode:performance",
    "Run Jasmine performance specs in Node.js",
    function() {
      require("shelljs").exec("node_modules/.bin/jasmine JASMINE_CONFIG_PATH=spec/support/jasmine-performance.json");
    }
  );
};
