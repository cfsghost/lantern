var fs = require('fs');
var path = require('path');
var co = require('co');

module.exports = {
	getPermissionList: function() {

		return function(done) {

			// Loading all roles in the directory
			var permissionDirPath = path.join(__dirname, '..', 'models', 'permissions');

			fs.readdir(permissionDirPath, function(err, files) {

				co(function *() {

					var perms = {};
					function getPerms(permission) {
						for (var key in permission.define) {
							perms[key] = permission.define[key];
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
	}
};
