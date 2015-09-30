var co = require('co');

export default function *() {

	var ctx = this;

	this.loader = {
		css: (url) => {
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

						yield function(done) {
							scriptjs(url, done);
						};
					}

					cb();
				});
			}
		}
	};
};
