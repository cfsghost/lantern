var crypto = require('crypto');
var mongoose = require('mongoose');
var Member = require('../models/member');
var settings = require('./config');
var utils = require('./utils');

module.exports = {
	create: function(member) {
		return function(done) {
			var _member = new Member({
				name: member.name,
				email: member.email,
				phone: member.phone,
				gender: member.gender,
				idno: member.idno,
				salt: utils.generateSalt(),
				birthday: member.birthday,
				cardno: member.cardno,
				tokens: member.tokens
			});

			// Encrypt plain password
			_member.password = utils.encryptPassword(_member.salt, member.password);

			member.save(function(err) {
				done(err, _member);
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
			Member.update({ _id: id }, {
				salt: utils.generateSalt(),
				password: crypto.createHmac('sha256', password + salt || '').digest('hex')
			}, done);
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

				// First time to login
				if (!member.password) {
					if (member.phone == password)
						return done(null, member);
					else
						return done(null, null);
				}

				// Check password
				if (utils.encryptPassword(member.salt, password) == member.password)
					return done(null, member);
				else
					return done(null, null);
			});
		};
	},
	save: function(id, member) {

		return function(done) {
			var updated = Date.now();

			Member.findOneAndUpdate({ _id: id }, {
				name: member.name,
				email: member.email,
				phone: member.phone,
				gender: member.gender,
				idno: member.idno,
				birthday: member.birthday,
				cardno: member.cardno || null,
				tokens: member.tokens,
				updated: updated
			}, function(err, _member) {

				if (err)
					return done(err);

				done(null, _member);
			});
		};
	},
	list: function() {

		var conditions = {};
		var columns;
		var opts = {};
		if (arguments.length == 2) {
			if (arguments[0] instanceof Array) {
				columns = arguments[0];
				opts = arguments[1];
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
