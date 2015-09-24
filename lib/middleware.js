var Member = require('./member');
var Permission = require('./permission');
var util = require('util');

module.exports = {
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

			// Require authorized
			if (!this.isAuthenticated()) {
				this.status = 404;
				return;
			}

			// Getting permission informations for such user
			var perms = yield Member.getPermissions(this.state.user.id);

			if (!perms) {
				this.status = 404;
				return;
			}

			// Check each permission
			var pass = permSets.every(function(permission) {

				var parts = permission.split('.');

				var cur = null;
				for (var index in parts) {
					var p = parts[index];

					if (!cur) {
						if (perms.hasOwnProperty(p)) {
							cur = perms[p];
							continue;
						}
					} else if (cur.hasOwnProperty(p)) {
						cur = cur[p];
					} else {
						cur = null;
						break;
					}
				}

				if (!cur) {
					return false;
				} else {
					return true;
				}
			});

			if (!pass) {
				this.status = 404;
				return;
			}

			yield next;
		};
	}
};
