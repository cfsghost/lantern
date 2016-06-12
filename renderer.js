var child_process = require('child_process');
var events = require('events');
var util = require('util');
var Utils = require('./lib/utils');

var Renderer = module.exports = function(num) {
	this.workerNum = num || 1;
	this.workers = [];
	this.curWorker = 0;
};

util.inherits(Renderer, events.EventEmitter);

Renderer.prototype.init = function() {
	var self = this;

	function handler(task) {
		var result = {};

		// Convert string to json and html.
		// For performance issue, we avoid using big json object between processes.
		result.id = task.substr(0, 32);
		if (task.substr(32, 1) == 'C') {
			result.html = task.substr(33);
		} else {
			result.redirect = task.substr(33);
		}

		self.emit(result.id, result);
	}

	return function(done) {

		// Starting workers
		for (var index = 0; index < self.workerNum; index++) {

			console.log('Starting renderer worker:', index);
			var worker = child_process.fork(`${__dirname}/renderer_worker.js`);

			worker.on('error', function(err) {
				console.log(err);
			});
			worker.on('message', handler);

			self.workers.push(worker);
		}

		done();
	};
};

Renderer.prototype.render = function(data) {
	var self = this;

	return function(done) {

		var worker = self.workers[self.curWorker++] || null;
		if (!worker) {
			self.curWorker = 1;
			worker = self.workers[0];
		}

		var id = Utils.generateUniqueId();
		self.once(id, function(result) {
			done(null, result);
		});

		worker.send({
			id: id,
			data: data
		});
	};
};
