var co = require('co');
import events from 'events';

export default function *() {

	var ctx = this;

	var pending = new events.EventEmitter();

	var store = this.getState('Loader', {
		css: [],
		script: []
	});

	this.loader = {
		css: (url) => {
			// It was already loaded
			if (store.css.indexOf(url) != -1)
				return;

			store.css.push(url);
			$('<link rel="stylesheet" type="text/css" href="' + url + '">').appendTo('head');
		},
		script: (url, cb) => {
			if (ctx.isBrowser) {
				var urls;
				if (!(url instanceof Array)) {
					urls = [ url ];
				} else {
					urls = url;
				}

				var scriptjs = require('scriptjs');

				co(function *() {

					for (var index in urls) {

						var url = urls[index];

						// Waiting if script is still loading
						if (pending.listenerCount(url)) {
							yield function(done) {
								pending.once(url, function() {
									done();
								});
							};

							continue;
						}

						// It was already loaded
						if (store.script.indexOf(url) != -1)
							continue;

						store.script.push(url);
						yield function(done) {
							pending.once(url, function() {
								done();
							});

							scriptjs(url, function() {
								pending.emit(url);
							});
						};
					}

					cb();
				});
			}
		}
	};
};
