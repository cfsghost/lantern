var crypto = require('crypto');
var uuid = require('node-uuid');
var co = require('co');

module.exports = function(lApp) {

	var settings = lApp.settings;
	var utils;
	var Permission;
	var Member;

	return {
		onload: function(lApp) {
			return function(done) {

				// Libraries
				utils = lApp.getLibrary('Utils');
				Permission = lApp.getLibrary('Permission');
				Member = lApp.getModel('Member');

				done();
			};
		},
		create: function(member) {
			return function(done) {
				co(function *() {
					var perms = yield Permission.createPermissionSettings();

					var data = {
						name: member.name,
						email: member.email,
						phone: member.phone,
						gender: member.gender,
						username: member.username || uuid.v1(),
						idno: member.idno,
						salt: utils.generateSalt(),
						birthday: member.birthday,
						cardno: member.cardno,
						tokens: member.tokens,
						signup_service: member.signup_service,
						facebook: member.facebook,
						github: member.github,
						linkedin: member.linkedin,
						google: member.google,
						permissions: perms
					};

					var _member = new Member(data);

					if (member.password) {
						// Encrypt plain password
						_member.password = utils.encryptPassword(_member.salt, member.password);
					} else {
						_member.password = '';
					}

					_member.save(function(err) {

						done(err, _member);
					});
				});

			};
		},
		getMember: function(id) {
			return function(done) {
				Member
					.findOne({ _id: id })
					.populate('permissions', '-_id -__v')
					.exec(function(err, member) {
						if (err)
							return done(err);

						if (!member)
							return done();

						return done(null, member);
					});
			};
		},
		getMemberByEmail: function(email) {
			return function(done) {
				Member.findOne({ email: email }, function(err, member) {
					if (err)
						return done(err);

					if (!member)
						return done();

					return done(null, member.toObject());
				});
			};
		},
		getMemberByUsername: function(username) {
			return function(done) {
				Member.findOne({ username: username }, function(err, member) {
					if (err)
						return done(err);

					if (!member)
						return done();

					return done(null, member.toObject());
				});
			};
		},
		exists: function(fields) {
			var self = this;

			return function(done) {

				co(function *() {
					var results = {};

					try {
						if (fields.email) {
							var m = yield self.getMemberByEmail(fields.email);
							results.email = m ? true : false;
						}

						if (fields.username) {
							var m = yield self.getMemberByUsername(fields.username);
							results.username = m ? true : false;
						}
					} catch(e) {
						return done(e);
					}

					done(null, results);
				});
			};
		},
		deleteMembers: function(ids) {
			return function(done) {
				Member.remove({
					_id: {
						$in: ids
					}
				}, function(err) {
					done(err);
				});
			};
		},
		insert: function(members) {
			return function(done) {

				Member.collection.insert(members, done);
			};
		},
		updateByEmail: function(email, member, opts) {

			return function(done) {

				// Update time
				member.updated = Date.now();

				Member.update({ email: email }, member, opts, done);
			};
		},
		changePassword: function(id, password) {
			return function(done) {

				// Generate a new salt for encryption
				var salt = utils.generateSalt();
				var newPassword = utils.encryptPassword(salt, password);

				// Update password
				Member.findOneAndUpdate({ _id: id }, {
					salt: salt,
					password: newPassword,
					updated: Date.now()
				}, { new: true }, function(err, member) {

					if (err)
						return done(err);

					done(null, member ? true : false);
				});
			};
		},
		changePasswordWithToken: function(id, token, password) {
			return function(done) {

				// Generate a new salt for encryption
				var salt = utils.generateSalt();
				var newPassword = utils.encryptPassword(salt, password);

				// TODO: Should check expired time of token
				// Update password
				Member.findOneAndUpdate({
					_id: id,
					'rule_tokens.name': 'reset_password'
				}, {
					$pull: {
						rule_tokens: {
							name: 'reset_password'
						}
					},
					salt: salt,
					password: newPassword,
					updated: Date.now()
				}, { new: true }, function(err, member) {

					if (err)
						return done(err);

					done(null, member ? true : false);
				});
			};
		},
		checkCard: function(token) {
			return function(done) {

				Member.findOne({ tokens: token }, function(err, member) {
					if (err)
						return done(err);

					if (!member)
						return done(new Error('Not Found'));

					return done(null, member);
				});
			};
		},
		authorizeMember: function(username, password) {
			return function(done) {

				Member.findOne({ email: username }, function(err, member) {
					if (err)
						return done(err);

					// Found nothing
					if (!member)
						return done();

					// First time to login
					if (!member.password) {

						// Using phone to be password
						if (member.phone == password)
							return done(null, member);
						else
							return done();
					}

					// Check password
					if (utils.encryptPassword(member.salt, password) == member.password)
						return done(null, member.toObject());
					else
						return done();
				});
			};
		},
		save: function(id, member) {

			return function(done) {
				var updated = Date.now();

				var m = {
					name: member.name || undefined,
					email: member.email || undefined,
					avatar: member.avatar || undefined,
					phone: member.phone || undefined,
					gender: member.gender || undefined,
					idno: member.idno || undefined,
					birthday: member.birthday || undefined,
					tokens: member.tokens || undefined,
					facebook: member.facebook || undefined,
					google: member.google || undefined,
					github: member.github || undefined,
					linkedin: member.linkedin || undefined,
					updated: updated
				};

				// Remove fields which is unset
				for (var key in m) {
					if (m[key] == undefined)
						delete m[key];
				}

				Member.findOneAndUpdate({ _id: id }, m, { new: true }, function(err, _member) {

					if (err)
						return done(err);

					done(null, _member);
				});
			};
		},
		updateRoles: function(id, roles) {

			return function(done) {
				var updated = Date.now();

				Member.findOneAndUpdate({ _id: id }, { roles: roles }, { new: true }, function(err, _member) {

					if (err)
						return done(err);

					done(null, _member.roles);
				});
			};
		},
		getPermissions: function(id) {
			return function(done) {
				Member
					.findOne({ _id: id })
					.populate('permissions', '-_id -__v')
					.exec(function(err, member) {
						if (err)
							return done(err);

						if (!member)
							return done();

						return done(null, member.permissions.toObject());
					});
			};
		},
		updatePermission: function(id, perms) {
			return function(done) {

				Member.findOne({ _id: id }, function(err, m) {

					if (err)
						return done(err);

					co(function *() {

						try {
							var newPerms = yield Permission.save(m.permissions, perms);
						} catch(e) {
							done(e);
							return;
						}

						done(null, newPerms);
					});
				});

			};
		},
		updatePermissionByEmail: function(email, perms) {
			return function(done) {

				Member.findOne({ email: email }, function(err, m) {

					if (err)
						return done(err);

					co(function *() {

						try {
							var newPerms = yield Permission.save(m.permissions, perms);
						} catch(e) {
							done(e);
							return;
						}

						done(null, newPerms);
					});
				});

			};
		},
		count: function() {
			return function(done) {
				Member.count({}, done);
			};
		},
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

				Member.count(conditions, function(err, count) {
					if (err) {
						done(err);
						return;
					}

					if (!count) {
						done(err, { count: 0 });
						return;
					}

					Member.find(conditions, cols, opts, function(err, members) {

						done(err, {
							count: count,
							members: members
						});
					});
				});
			};
		},
		setupRuleToken: function(id, name, expired) {

			return function(done) {

				var token = utils.generateToken();

				// Remove old token
				Member.findOneAndUpdate({
					_id: id,
					'rule_tokens.name': name
				}, {
					$pull: {
						rule_tokens: {
							name: name
						}
					}
				}, function(err) {
					if (err) {
						return done(err);
					}

					// Update rule token. add a new one if no key exists
					Member.findOneAndUpdate({
						_id: id
					}, {
						$addToSet: {
							rule_tokens: {
								name: name,
								token: token,
								expired: expired
							}
						}
					}, function(err, member) {

						done(err, member ? {
							token: token,
							id: member._id
						} : null);
					});
				});

			};
		},
		setupRuleTokenByEmail: function(email, name, expired) {

			return function(done) {

				var token = utils.generateToken();

				// Remove old token
				Member.findOneAndUpdate({
					email: email,
					'rule_tokens.name': name
				}, {
					$pull: {
						rule_tokens: {
							name: name
						}
					}
				}, function(err) {
					if (err) {
						return done(err);
					}

					// Update rule token. add a new one if no key exists
					Member.findOneAndUpdate({
						email: email
					}, {
						$addToSet: {
							rule_tokens: {
								name: name,
								token: token,
								expired: expired
							}
						}
					}, function(err, member) {

						done(err, member ? {
							token: token,
							id: member._id
						} : null);
					});
				});

			};
		},
		updateCardno: function(id, cardno) {

			return function(done) {
				Member.update({ _id: id }, {
					cardno: cardno,
					updated: Date.now()
				}, done);
			};
		},
		updateCardnoByEmail: function(email, token, cardno) {

			return function(done) {
				Member.update({ email: email }, {
					tokens: [ token ],
					cardno: cardno,
					updated: Date.now()
				}, done);
			};
		}
	};
};
