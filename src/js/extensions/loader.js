var co = require('co');

export default function *() {

	var ctx = this;

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

						// It was already loaded
						if (store.script.indexOf(urls[index]) != -1)
							continue;

						store.script.push(urls[index]);
						yield function(done) {
							scriptjs(urls[index], done);
						};
					}

					cb();
				});
			}
		}
	};
};
