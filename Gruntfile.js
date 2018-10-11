/*global module*/

module.exports = function (grunt) {
  grunt.initConfig({
    // Specify how to "inline" all the content
    inline: {
      options: {
        cssmin: true,
        uglify: true,
        tag: '__inline',
        babel: {
          plugins: ["transform-es2015-arrow-functions"],
          presets: [["es2015", {modules: false}]] //[ "env" ]
        }
      },
      map_viewer: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      }
    },
    copy: {
      vendor: {
        expand: true,
        cwd: "src/vendor",
        src: "**",
        dest: "dist/vendor",
        filter: "isFile"
      },
      img: {
        expand: true,
        cwd: "src/img",
        src: "**",
        dest: "dist/img",
        filter: "isFile"
      },
      css: {
        expand: true,
        cwd: "src/css",
        src: "**",
        dest: "dist/css",
        filter: "isFile"
      }
    }

  });

  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  //grunt.registerTask('default', ['copy:src', 'copy:meta_data']);
  grunt.registerTask('default', ['inline:map_viewer', 'copy:img', 'copy:css', 'copy:vendor']);
  //inline:map_viewer', "copy:meta_data", "copy:images", "copy:data", "copy:vendor", "copy:vendor_images"]);
}
