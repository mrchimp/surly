module.exports = function(grunt) {

  var js_files = [
    'public/bower_components/jquery/dist/jquery.js',
    'frontend_src/js/main.js',
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: js_files,
        dest: 'public/js/main.js'
      },
    },
    uglify: {
      options: {
        mangle: false,
        compress: false
      },
      build: {
        files: {
          'public/js/main.min.js': js_files
        }
      },
    },
    // less: {
    //   dist: {
    //     options: {
    //       paths: [
    //         'app/assets/less',
    //         'bower_components/bootstrap/less'
    //       ],
    //       cleancss: true
    //     },
    //     files: {
    //       'public/assets/css/bootstrap.min.css': 'app/assets/less/bootstrap.less'
    //     }
    //   },
    //   dev: {
    //     options: {
    //       paths: [
    //         'app/assets/less',
    //         'bower_components/bootstrap/less'
    //       ],
    //     },
    //     files: {
    //       'public/assets/css/bootstrap.min.css': 'app/assets/less/bootstrap.less'
    //     }
    //   },
    // },
    focus: {
      all: {}
    },
    watch: {
      // less: {
      //   files: ['app/assets/less/**/*.less'],
      //   tasks: ['less:frontendDev'],
      //   options: {
      //     nospawn: true
      //   }
      // },
      watchjs: {
        files: js_files,
        tasks: ['concat:dist'],
        options: {
          nospawn: true
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-focus');

  grunt.registerTask('default', ['concat'/*, 'less:frontendDev', 'less:backendDev'*/]);
  grunt.registerTask('dist', ['concat', 'uglify'/*, 'less:frontendDist', 'less:backendDist'*/]);
  grunt.registerTask('all', ['concat', 'uglify'/*, 'dist', 'less:dev'*/]);
  grunt.registerTask('watch-all', ['focus:all']);
};
