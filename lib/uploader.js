var fs = require('fs');
var fse = require('fs-extra');
var stream = require('stream');
var path = require('path');
var co = require('co');
var settings = require('./config');
var crypto = require('crypto');
var parseMultipart = require('co-busboy');
var Utils = require('./utils');
var Storage = require('./storage');

var tempDir = '';

module.exports = {
	init: function() {

		return function(done) { 

			co(function *() {
				console.log('Initializing Uploader support...');

				var storagePath = yield Storage.getPath('uploader');

				console.log('Using uploader path:', storagePath);
				console.log('Initializing uploader directory ...');
				fse.mkdirs(storagePath, function(err) {
					tempDir = storagePath;

					done(err);
				});

			});
		};
	},
	checkRequest: function(ctx) {
		return ctx.request.is('multipart/*')
	},
	parse: function(ctx) {

		// Parsing multipart
		return parseMultipart(ctx);
	},
	getBase64File: function(data) {

		return function(done) {

			var file = Utils.decodeBase64Image(data);

			var s = new stream.Readable();

			done(null, {
				type: file.type,
				stream: s
			});

			s.push(file.data);
			s.push(null);
		};

	},
	getFile: function(parts) {
		return parts;
	},
	saveFile: function(part, targetPath) {

		return function(done) {

			// Generator a path
			var filepath = targetPath || path.join(tempDir, Math.random().toString());
			var stream = fs.createWriteStream(filepath);

			stream.on('finish', function() {
				done(null, filepath);
			});

			// Saving
			part.pipe(stream);
		};
	}
};
