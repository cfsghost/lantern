import request from 'superagent';

export default function *() {

	var isomorphicUrl = function(url) {
		if (this.isBrowser)
			return url;

		if (url[0] === '/') {
			if (this.options.externalUrl) {
				return this.options.externalUrl + url;
			}
		}

		return url;
	}.bind(this);

	var get = function() {
		var args = Array.prototype.slice.call(arguments);
		args[0] = isomorphicUrl(args[0]);

		var req = request.get.apply(request, args);

		// Server rendering
		if (!this.isBrowser && this.options.cookie) {
			req.set('Cookie', this.options.cookie);
		}

		return req;
	}.bind(this);

	var post = function() {
		var args = Array.prototype.slice.call(arguments);
		args[0] = isomorphicUrl(args[0]);

		var req = request.post.apply(request, args);

		// Server rendering
		if (!this.isBrowser && this.options.cookie) {
			req.set('Cookie', this.options.cookie);
		}

		return req;
	}.bind(this);

	var del = function() {
		var args = Array.prototype.slice.call(arguments);
		args[0] = isomorphicUrl(args[0]);

		var req = request.del.apply(request, args);

		// Server rendering
		if (!this.isBrowser && this.options.cookie) {
			req.set('Cookie', this.options.cookie);
		}

		return req;
	}.bind(this);

	var put = function() {
		var args = Array.prototype.slice.call(arguments);
		args[0] = isomorphicUrl(args[0]);

		var req = request.put.apply(request, args);

		// Server rendering
		if (!this.isBrowser && this.options.cookie) {
			req.set('Cookie', this.options.cookie);
		}

		return req;
	}.bind(this);

	this.request = {
		get: get,
		post: post,
		del: del,
		put: put
	};
};
