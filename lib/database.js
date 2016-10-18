var mongoose = require('mongoose');

module.exports = {

	onload: function(lApp) {

		return function(done) {

			var settings = lApp.settings;
			var mongos = settings.general.database.mongos || null;

			mongoose.connect(settings.general.database.uri, mongos);
			var db = mongoose.connection;
			db.once('open', function() {
				done();
			});
		};
	}
};
