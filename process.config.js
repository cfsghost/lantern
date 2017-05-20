var path = require('path');
var fs = require('fs');
var settings = {};

try {
	var data = fs.readFileSync(path.join(__dirname, 'configs', 'general.json'));
	settings.general = JSON.parse(data);
} catch(e) {
	var data = fs.readFileSync(path.join(__dirname, 'configs', 'general.json.default'));
	settings.general = JSON.parse(data);
}

module.exports = {
	apps : [{
	    "script": "./app.js",
	    "name": settings.general.service.name,
	    "exec_interpreter": "node",
	    "interpreter_args": "--harmony",
	    "exec_mode": "cluster",
	    "instances": 1,
		"env": {
			"NODE_ENV": "development",
		},
		"env_production" : {
			"NODE_ENV": "production"
		}
	}]
}
