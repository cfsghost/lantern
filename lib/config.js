var path = require('path');
var fs = require('fs');
var settings = {};

try {
	var data = fs.readFileSync(path.join(__dirname, '..', 'configs', 'general.json'));
	settings.general = JSON.parse(data);
} catch(e) {
	console.warn('[warning]', 'No configuration file exists, using default settings.');
	var data = fs.readFileSync(path.join(__dirname, '..', 'configs', 'general.json.default'));
	settings.general = JSON.parse(data);
}

if (!settings.general.features)
	settings.general.features = {};

module.exports = settings;
