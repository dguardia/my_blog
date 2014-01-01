/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
              '* <%= pkg.name %>.js v<%= pkg.version %>\n' +
              '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
              '*/\n',
    jqueryCheck: 'if (!jQuery) { throw new Error(\"<%= pkg.name %> requires jQuery\") }\n\n',


    // -----------------------------------
    //
    // TASK: clean  [Remove old files]
    //
    // -----------------------------------
    clean: {
      dist: [
         'assets/css/<%= pkg.name %>.css'
       , 'assets/css/<%= pkg.name %>.min.css'
       , 'assets/js/<%= pkg.name %>.js'
       , 'assets/js/<%= pkg.name %>.min.js'
      ]
    },


    // -----------------------------------
    //
    // TASK: jshint  [Validate .js]
    //
    // -----------------------------------
    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'bootstrap/js/*.js', 'assets/js/totop/*.js'],   //'assets/**/*.js'
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // override JSHint defaults
        jshintrc: 'bootstrap/js/.jshintrc',
        // A directive for telling JSHint about global variables that are defined elsewhere.
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },


    // -----------------------------------
    // Notes:
    //
    // We have several options regarding how we process CSS
    // Ideally, our end goal is one, minified, CSS file.
    // If we have only LESS source code then we are in good shape
    // because we can just use Recess to compile and minify the CSS.
    // However we may also have some CSS snippets that we don't need/
    // want to convert to less (such as the syntax.css file).
    // Therefore we have more steps but more flexibility:
    //
    // 1. Compile LESS to a CSS file [recess]
    // 2. Concatenate all CSS files together [concat]
    // 3. Minify the CSS
    //
    // -----------------------------------



    // -----------------------------------
    //
    // TASK: concat  [Concatenate .js and .css]
    //
    // -----------------------------------
    concat: {
      options: {        // Task-level options may go here, overriding task defaults.
        banner: '<%= banner %><%= jqueryCheck %>',
        stripBanners: false
      },
      js: {
        options: {      // "js" target options may go here, overriding task-level options.
          banner: '<%= banner %><%= jqueryCheck %>',
          stripBanners: false
        },
        src: [
          'bootstrap/js/transition.js',
          'bootstrap/js/alert.js',
          'bootstrap/js/button.js',
          //'bootstrap/js/carousel.js',
          //'bootstrap/js/collapse.js',
          //'bootstrap/js/dropdown.js',
          'bootstrap/js/modal.js',
          //'bootstrap/js/tooltip.js',
          //'bootstrap/js/popover.js',
          //'bootstrap/js/scrollspy.js',
          //'bootstrap/js/tab.js',
          'bootstrap/js/affix.js'
        ],
        dest: 'assets/js/<%= pkg.name %>.js'
      },
      css: {
        options: {     // "css" target options may go here, overriding task-level options.
          banner: '/* <%= pkg.name %>.css v<%= pkg.version %> */\n',
          stripBanners: true
        },
        src: [
          'assets/css/<%= pkg.name %>.css',                     // Main CSS file built from main.less
          //'assets/fonts/font-awesome/css/font-awesome.min.css', // Font Awesome
          'assets/css/syntax.css',                              // Code syntax highlighting
          'assets/fonts/ss-social-circle/ss-social-circle.css'  // Social Icons
        ],
        dest: 'assets/css/<%= pkg.name %>.css'
      }
    },


    // -----------------------------------
    //
    // TASK: uglify           [Minify .js]
    //
    // -----------------------------------
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      js: {
        src: ['<%= concat.js.dest %>'],
        dest: 'assets/js/<%= pkg.name %>.min.js'
      }
    },


    // -----------------------------------
    //
    // TASK: cssmin          [Minify .css]
    //
    // -----------------------------------
    cssmin: {
      css:{
        src: 'assets/css/<%= pkg.name %>.css',
        dest: 'assets/css/<%= pkg.name %>.min.css'
      }
    },


    // -----------------------------------
    //
    // TASK: recess  [Compile/minify LESS/CSS]
    //
    // -----------------------------------
    // recess: {
    //   options: {
    //     compile: true
    //   },
    //   bootstrap: {
    //     src: ['less/<%= pkg.name %>.less'],
    //     dest: 'assets/css/<%= pkg.name %>.css'
      // },
      // Since we are adding additional css snippets with
      // the concat step after recess compiles the less
      // code we will then use  cssmin to minify the final
      // result.  Hence no need to create a minified version
      // here.
      // ------------
      // min: {
      //   options: {
      //     compress: true
      //   },
      //   //src: ['bootstrap/less/bootstrap.less'],
      //   src: ['less/main.less'],
      //   dest: 'assets/css/<%= pkg.name %>.min.css'
    //   }
    // },

    // -----------------------------------
    //
    // TASK: less [Compile/minify LESS/CSS]
    //
    // -----------------------------------
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'assets/css/<%= pkg.name %>.css.map'
        },
        files: {
          'assets/css/<%= pkg.name %>.css': 'less/<%= pkg.name %>.less'
        }
      },
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          'assets/css/<%= pkg.name %>.min.css': 'assets/css/<%= pkg.name %>.css'
        }
      }
    },


    // -----------------------------------
    //
    // TASK: jekyll       [Build the html]
    //
    // -----------------------------------
    jekyll: {
      docs: {}
    },


    // -----------------------------------
    //
    // TASK: validation[Validate the html]
    //
    // -----------------------------------
    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
          'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
          'Element img is missing required attribute src.'
        ]
      },
      files: {
        src: ['_site/**/*.html']
      }
    },


    // -----------------------------------
    //
    // TASK: htmlmin     [Minify the HTML]
    //
    // -----------------------------------
    htmlmin: {                          // Task
      dist: {                           // Target
        options: {                      // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand : true,
          cwd    : '_site/',            //cwd: All src matches are relative to (but don't include) this path.
          src    : '**/*.html',
          dest   : '_site/'
        }]
      }
    },


    // -----------------------------------
    //
    // TASK: imagemin    [Optimize Images]
    //
    // -----------------------------------
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: '/Users/Dan/Dropbox/public/blog-images/',  // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: '/Users/Dan/Dropbox/public/blog-images/'  // Destination path prefix
        }]
      }
    },



    // -----------------------------------
    //
    // TASK: connect       [static server]
    //
    // -----------------------------------
    // https://github.com/gruntjs/grunt-contrib-connect
    connect: {
      server: {
        options: {
          port: 3000,
          base: '_site'
        }
      }
    },


    // -----------------------------------
    //
    // TASK: watch
    //
    // -----------------------------------
    watch: {
      js: {
        files: ['bootstrap/js/*.js'],   //'assets/**/*.js'
        tasks: ['dist-js'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['less/*.less', 'less/bootstrap/*.less'],
        tasks: ['dist-css'],
        options: {
          livereload: true,
        }
      },
      html: {
        files: ['*.html', '_includes', '_layouts', '_posts'],
        tasks: ['jekyll'],
        options: {
          livereload: true,
        }
      }
    },


    // -----------------------------------
    //
    // TASK: exec           [Upload to S3]
    // `exec` runs commands
    // -----------------------------------
      exec: {
        list_files: {
          cmd: 'ls -l **'
        },
        echo_grunt_version: {
          cmd: function() { return 'echo ' + this.version; }
        },
        s3: {
          cmd: 's3_website push',
          stdout: true,
          stderr: true
        }
      }


  });

 /*
  *  This section is where we require the necessary plugins.
  *
  *  Let's be elegant and just tell Grunt
  *  to read our package.json devDependencies:
  */
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});



  // Docs HTML validation task
  grunt.registerTask('develop', ['connect', 'watch']);

  // Docs HTML validation task
  grunt.registerTask('validate-docs', ['jekyll', 'validation']);

  // Lint the .js and test for HTML5 validity
  grunt.registerTask('test', ['jshint', 'validate-docs']);

  // Optimize all images
  grunt.registerTask('opt-images', ['imagemin']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat:js', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'concat:css', 'cssmin']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'htmlmin']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);

  // Full Monte
  grunt.registerTask('full', ['test', 'dist', 'exec']);

};
