var path = require('path');
var settings = require('./config');
var fse = require('fs-extra');

var storage = {
	type: 'local',
	path: path.join(__dirname, '..', 'storage')
};

var pathMap = {};

var Storage = module.exports = {
	init: function() {
		return function(done) { 

			console.log('Initializing storage ...');
			if (settings.general.storage) {

				if (settings.general.storage.type == 'local') {

					storage.type = settings.general.storage.type;

					var dirPath = settings.general.storage.path;
					if (dirPath[0] == '/') {
						storage.path = dirPath;
					} else {
						storage.path = path.join(__dirname, '..', dirPath);
					}
				}
			}

			console.log('Using storage type:', storage.type);
			console.log('Using storage path:', storage.path);
			console.log('Initializing storage directory ...');
			fse.mkdirs(storage.path, function(err) {
				if (err)
					return done(err);

				done(null, storage);
			});
		};
	},
	getPath: function(type) {
		return function(done) {

			var storagePath = pathMap[type] || path.join(storage.path, type);

			fse.mkdirs(storagePath, function(err) {
				if (err)
					return done(err);

				done(null, storagePath);
			});
		};
	}
};
