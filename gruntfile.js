module.exports = function(grunt) {

  var pkgJSON = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkgJSON,

    // Concatenate ...
    concat: {

      // ... all the vendor libraries
      vendorLibs: {
        src: [
          'assets/js/vendor/jquery-2.1.1.js',
          'assets/js/vendor/underscore-1.6.0.js',
          'assets/js/vendor/backbone-1.1.1.js',
          'assets/js/vendor/marionette-1.6.2.js',
        ],
        dest: 'tmp/vendorlibs.js',
      },

      // ... core JS files
      core: {
        src: [
          'assets/js/endeavour.js',
          'assets/js/router.js',
        ],
        dest: 'tmp/core.js',
      },

      // ... then the models
      models: {
        src: ['assets/js/models/**/*'],
        filter: 'isFile',
        dest: 'tmp/models.js',
      },

      // ... then the abstract views
      abstractViews: {
        src: ['assets/js/views/**/*'],
        filter: function(filepath) {
          // grunt.log.write(filepath.replace(/\\/g, '/') + "\n");
          var isJSFile = filepath.match(/\.js$/);
          return isJSFile && pkgJSON.abstractViews.indexOf(filepath.replace(/\\/g, '/')) > -1;
        },
        dest: 'tmp/abstractViews.js',
      },

      // ... then the concrete views
      remainingViews: {
        src: ['assets/js/views/**/*'],
        filter: function(filepath) {
          var isJSFile = filepath.match(/\.js$/);
          return isJSFile && pkgJSON.abstractViews.indexOf(filepath.replace(/\\/g, '/')) < 0;
        },
        dest: 'tmp/remainingViews.js',
      },

      // ... then our start script goes in last
      start: {
        src: ['assets/js/start.js'],
        dest: 'tmp/start.js',
      },

      // ... then we concatenate everything so far
      everything: {
        src: [
          'tmp/vendorlibs.js',
          'tmp/core.js',
          'tmp/models.js',
          'tmp/abstractViews.js',
          'tmp/remainingViews.js',
          'tmp/start.js',
        ],
        dest: 'tmp/app.js',
      },

    },

    // Uglify/compress
    uglify: {
      options: {
        banner: '/*!\n\n    Package: <%= pkg.name %>\n    Version: <%= pkg.version %>\n    Built: <%= grunt.template.today("yyyy-mm-dd @ h:MM:ss TT") %>\n\n    Copyright (c) 2014 Cal Milne.\n\n    Special thanks to jQuery, Backbone.js, Underscore.js, Marionette.js, Node.js, Grunt.js, and SASS.\n    Without you this wouldn\'t have been possible!\n\n*/\n\n',
        mangle: true,
      },
      build: {
        src: 'tmp/app.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify']);

};