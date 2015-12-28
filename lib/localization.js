var fs = require('fs');
var path = require('path');
var co = require('co');

var translationPath = path.join(__dirname, '..', 'locales');
var translations = {};

module.exports = {
	getRawTranslation: function(locale) {
		return function(done) {

			try {
				var messages = require(path.join(translationPath, locale.toLowerCase() + '.js'));
			} catch(e) {
				return done(null, {});
			}

			done(null, messages);
		};
	},
	getTranslations: function(locales) {
		return function(done) {

			co(function *() {

				for (var index in locales) {
					var locale = locales[index];

					if (!translations[locale]) {

						try {
							var messages = require(path.join(translationPath, locale.toLowerCase() + '.js'));
						} catch(e) {
							continue;
						}

						translations[locale] = messages;
					}
				}

				done(null, translations);
			});
		};
	}
};
