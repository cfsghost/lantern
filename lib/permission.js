var fs = require('fs');
var path = require('path');
var co = require('co');

var Permission = require('../models/permission');

module.exports = {
	getAvailablePermissions: function() {

		return function(done) {

			// Loading all roles in the directory
			var permissionDirPath = path.join(__dirname, '..', 'models', 'permissions');

			fs.readdir(permissionDirPath, function(err, files) {

				co(function *() {

					var perms = {};
					function getPerms(permission) {
						for (var key in permission.define) {
							perms[[ permission.name, key ].join('.')] = permission.define[key];
						}
					}

					yield function(done) {

						// Load all files for permission define
						files.forEach(function(filename) {

							var permission = require(path.join(permissionDirPath, filename));
							getPerms(permission);
						});

						done();
					};

					done(null, perms);
				});
			});

		};
	},
	validate: function(perms) {
		var self = this;

		return function(done) {

			co(function *() {

				// Getting all available permissions
				var availPerms = yield self.getAvailablePermissions();

				// Check all
				perms.forEach(function(perm) {

					// Not valid permission
					if (!availPerms[perms]) {
						done(null, false);
						return false;
					}
				});

				done(null, true);
			});
		}
	},
	createPermissionSettings: function() {

		return function(done) {

			var perm = new Permission();
			perm.save(function(err) {

				done(null, perm);
			});
		}
	},
	save: function(id, perms) {
		return function(done) {
			var updateCmd = {
				$set: {}
			};

			// Prepare an object to set permissions
			for (var index in perms) {
				var perm = perms[index];
				updateCmd['$set'][perms] = true;
			}

			Permission.findOneAndUpdate({ _id: id }, updateCmd, function(err) {
				console.log(id, perms);
				done(err);
			});
		};
	}
};
