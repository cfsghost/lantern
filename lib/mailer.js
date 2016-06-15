var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');

var transporter;

module.exports = function(lApp) {

	var settings;

	var Mailer = {
		onload: function(lApp) {

			settings = lApp.settings;

			return function(done) {

				if (settings.general.mailer.service == 'Gmail') {

					// Initializing XOAuth2
					var generator = require('xoauth2')
						.createXOAuth2Generator(settings.general.mailer.auth);

					// Create a pool of connections
					var pool = smtpPool({
						service: settings.general.mailer.service,
						auth: {
							xoauth2: generator
						}
					});

					// Create a transport
					transporter = nodemailer.createTransport(pool);

					done();
					return;
				}

				// Create a pool of connections for specific mail service
				var pool = smtpPool({
					service: settings.general.mailer.service,
					auth: settings.general.mailer.auth
				});

				// Create a transport
				transporter = nodemailer.createTransport(pool);

				done();
			};
		},
		sendMail: function(msg) {

			return function(done) {

				transporter.sendMail(msg, done);
			};
		},
		sendMailFromService: function(to, subject, html) {

			return Mailer.sendMail({
				from: settings.general.mailer.sender.name + ' <' + settings.general.mailer.sender.address + '>',
				to: to,
				subject: subject,
				html: html
			});
		}
	};

	return Mailer;
};
