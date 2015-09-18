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

					var groups = {};
					var perms = {};
					function getPerms(name, permission) {
						for (var key in permission.define) {
							perms[[ name, key ].join('.')] = permission.define[key];
						}
					}

					yield function(done) {

						// Load all files for permission define
						files.forEach(function(filename) {
							var name = path.basename(filename, '.js');

							var permission = require(path.join(permissionDirPath, filename));

							getPerms(name, permission);
							groups[name] = permission.name;
						});

						done();
					};

					done(null, {
						perms: perms,
						groups: groups
					});
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
					if (!availPerms.perms[perms]) {
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
			for (var key in perms) {
				updateCmd['$set'][key] = perms[key];
			}

			Permission.findOneAndUpdate({ _id: id }, updateCmd, { new: true, fields: '-_id -__v' }, function(err, p) {
				done(err, p);
			});
		};
	}
};
