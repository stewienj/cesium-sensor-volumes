/* eslint-env browser */
'use strict';

var allTestFiles = [];
var TEST_REGEXP = /^\/base\/test\/.*(spec)\.js$/;
var WEBGL_REGEXP = /webgl/;

function pathToModule(path) {
	return path.replace(/^\/base\//, '').replace(/\.js$/, '');
}

var excludeWebGl = false;
if (window.__karma__.config.args) {
	excludeWebGl = window.__karma__.config.args[0];
}

Object.keys(window.__karma__.files).forEach(function(file) {
	if (TEST_REGEXP.test(file)) {
		// exclude WebGL tests
		if (!excludeWebGl || !WEBGL_REGEXP.test(file)) {
			// Normalize paths to RequireJS module names.
			allTestFiles.push(pathToModule(file));
		}
	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base/lib',

	paths: {
		Cesium: '../node_modules/cesium/Source',

		text: '../node_modules/requirejs-text/text',

		test: '../test'
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});
