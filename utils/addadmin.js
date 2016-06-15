var argv = require('minimist')(process.argv.slice(2));

if (!argv._.length) {
	console.error('Usage: addadmin [email]');
	process.exit();
	return;
}

var email = argv._[0];

var path = require('path');
var co = require('co');
var lampion = require('lampion');

co(function *() {
	var lApp = lampion({
		worker: true,
		appPath: path.join(__dirname, '..')
	});

	yield lApp.configure();

	// Library
	var Member = lApp.getLibrary('Member');

	try {
		var m = yield Member.updatePermissionByEmail(email, {
			'admin.access': true,
			'admin.users': true,
			'admin.roles': true
		});
	} catch(e) {
		console.log(e.stack);
		return;
	}

	if (m) {
		console.log(email, 'is administrator now.');
	} else {
		console.log('No such account.');
	}

	process.exit();
}).catch(function(e) {
	console.error(e.stack);
});
