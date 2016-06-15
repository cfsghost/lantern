var util = require('util');

module.exports = function(lApp) {

	var Permission;

	return {
		onload: function() {
			return function(done) {
				Permission = lApp.getLibrary('Permission');

				done();
			};
		},
		requireAuthorized: function *(next) {
			if (!this.isAuthenticated()) {
				this.status = 404;
				return;
			}

			yield next;
		},
		allow: function(permissions) {

			return function *(next) {
				// Allow all if nothing
				if (!permissions) {
					yield next;
					return;
				}

				// Prepare permission if it is string
				var permSets;
				if (util.isString(permissions)) {
					permSets = [ permissions ];
				} else if (permissions.length == 0) {
					yield next;
					return;
				} else {
					permSets = permissions;
				}

				// Not yet login then redirect to sign in page
				var indexOfAccess = permSets.indexOf('user.access');
				if (indexOfAccess != -1) {
					if (!this.isAuthenticated()) {
						this.redirect('/signin?target=' + this.req.url);
						return;
					}

					permSets.splice(indexOfAccess, 1);
				}

				// Require authorized
				if (!this.isAuthenticated()) {
					this.status = 404;
					return;
				}

				// Getting permission informations for such user
				var perms = this.state.user.permissions;

				if (!perms) {
					this.status = 404;
					return;
				}

				// Check each permission
				var pass = permSets.every(function(permission) {

					var parts = permission.split('.');

					if (parts.length != 2)
						return false;

					var group = parts[0];
					var name = parts[1];

					if (perms.hasOwnProperty(group)) {
						if (perms[group].hasOwnProperty(name)) {
							if (perms[group][name]) {
								return true;
							}
						}
					}

					return false;
				});

				if (!pass) {
					this.status = 404;
					return;
				}

				yield next;
			};
		}
	};
};
