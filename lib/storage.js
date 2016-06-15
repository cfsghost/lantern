var path = require('path');
var fse = require('fs-extra');

module.exports = function(lApp) {

	var settings = lApp.settings;
	var storage = {
		type: 'local',
		path: path.join(__dirname, '..', 'storage')
	};

	var pathMap = {};

	return {
		onload: function(lApp) {

			return function(done) { 

				lApp.log('Initializing storage ...');
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

				lApp.log('Using storage type:', storage.type);
				lApp.log('Using storage path:', storage.path);
				lApp.log('Initializing storage directory ...');
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
};
