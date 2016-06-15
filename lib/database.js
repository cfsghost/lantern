var mongoose = require('mongoose');

module.exports = {

	onload: function(lApp) {

		return function(done) {

			var settings = lApp.settings;

			mongoose.connect(settings.general.database.uri);
			var db = mongoose.connection;
			db.once('open', function() {
				done();
			});
		};
	}
};
