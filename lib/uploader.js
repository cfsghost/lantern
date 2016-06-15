var fs = require('fs');
var fse = require('fs-extra');
var stream = require('stream');
var path = require('path');
var co = require('co');
var crypto = require('crypto');
var parseMultipart = require('co-busboy');

module.exports = function(lApp) {

	var settings = lApp.settings;
	var Storage;
	var Utils;
	var tempDir = '';

	return {
		onload: function(lApp) {

			return function(done) { 

				Storage = lApp.getLibrary('Storage');
				Utils = lApp.getLibrary('Utils');

				co(function *() {
					lApp.log('Initializing Uploader support...');

					var storagePath = yield Storage.getPath('uploader');

					lApp.log('Using uploader path:', storagePath);
					lApp.log('Initializing uploader directory ...');
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
};
