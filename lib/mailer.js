var settings = require('./config');
var nodemailer = require('nodemailer');

var transporter;

module.exports = {
	init: function() {

		return function(done) {
			// Initializing mailer
			transporter = nodemailer.createTransport({
				service: settings.general.mailer.service,
				auth: {
					user: settings.general.mailer.user,
					pass: settings.general.mailer.password
				}
			});

			done();
		});
	},
	sendMail: function(msg) {

		return function(done) {

			transporter.sendMail(msg, done);
		};
	}
};
