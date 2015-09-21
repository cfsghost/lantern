var co = require('co');
var Role = require('../models/role');
var Permission = require('./permission');

module.exports = {
	list: function() {

		var conditions = {};
		var columns;
		var opts = {};
		if (arguments.length == 3) {
			conditions = arguments[0];
			columns = arguments[1];
			opts = arguments[2];
		} else if (arguments.length == 2) {
			if (arguments[0] instanceof Array) {
				columns = arguments[0];
				opts = arguments[1];
			} else if (arguments[1] instanceof Array) {
				conditions = arguments[0];
				columns = arguments[1];
			} else {
				conditions = arguments[0];
				opts = arguments[1];
			}
		} else if (arguments.length == 1) {
			columns = null;
			opts = arguments[0];
		}

		return function(done) {

			var cols = null;
			if (columns)
				cols = columns.join(' ');

			Role.count(conditions, function(err, count) {
				if (err) {
					done(err);
					return;
				}

				if (!count) {
					done(err, { count: 0 });
					return;
				}

				var populated = false;
				if (opts.populatedPermission) {

					// Take off this property for Mongo DB competibility
					delete opts.populatedPermission;
					populated = true;
				}

				var query = Role.find(conditions, cols, opts);

				if (populated) {
					query.populate('permissions', '-_id -__v');
				}

				query.exec(function(err, roles) {

					done(err, {
						count: count,
						roles: roles 
					});
				});
			});
		};
	},
	getRole: function(id) {
		return function(done) {
			Role
				.findOne({ _id: id })
				.populate('permissions', '-_id -__v')
				.exec(function(err, role) {
					if (err)
						return done(err);

					if (!role)
						return done();

					return done(null, role);
				});
		};
	},
	updatePermission: function(id, perms) {
		return function(done) {

			Role.findOne({ _id: id }, function(err, r) {

				if (err)
					return done(err);
				
				co(function *() {

					try {
						var newPerms = yield Permission.save(r.permissions, perms);
					} catch(e) {
						done(e);
						return;
					}

					done(null, newPerms);
				});
			});
			
		};
	},
	create: function(role) {

		return function(done) {
			
			co(function *() {

				// Create a new permission settings for new role
				var perms = yield Permission.createPermissionSettings();

				try {
					console.log(perms);
					// Setup permission
					var newPerms = yield Permission.save(perms._id, role.perms);
				} catch(e) {
					done(e);
					return;
				}

				// Create a new role
				var _role = new Role({
					name: role.name,
					desc: role.desc,
					permissions: perms
				});

				_role.save(function(err) {
					done(err, _role);
				});
			});
		};
	},
	save: function(id, role) {

		return function(done) {

			var r = {
				name: role.name || undefined,
				desc: role.desc || undefined
			};

			// Remove fields which is unset
			for (var key in r) {
				if (r[key] == undefined)
					delete r[key];
			}

			Role.findOneAndUpdate({ _id: id }, r, { new: true }, function(err, _role) {

				if (err)
					return done(err);

				done(null, _role);
			});
		};
	}
};
