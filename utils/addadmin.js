var argv = require('minimist')(process.argv.slice(2));

if (!argv._.length) {
	console.error('Usage: addadmin [email]');
	process.exit();
	return;
}

var email = argv._[0];

var co = require('co');
var Database = require('../lib/database');
var Member = require('../lib/member');

co(function *() {
	yield Database.init();

	try {
		var m = yield Member.updatePermissionByEmail(email, {
			'admin.access': true,
			'admin.users': true,
			'admin.roles': true
		});
	} catch(e) {
	}

	if (m) {
		console.log(email, 'is administrator now.');
	} else {
		console.log('No such account.');
	}

	process.exit();
});
