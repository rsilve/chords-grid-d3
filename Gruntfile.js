'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	  connect: {
	      server: {
	        options: {
	          port: 9001,
	          base: ['bower_components', 'js','test']
	        }
	      }
	    },
    watch: {
      reload: {
		options: { livereload: true},
        files: ['js/*', 'test/*'],
      }
    },
    clean: ["target"]	
  });
  
	
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['connect', 'watch']);

};