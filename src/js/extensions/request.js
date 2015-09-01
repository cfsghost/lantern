import request from 'superagent';

export default function *() {

	// Customize superagent
	var prefix = function(request) {
		if (request.url[0] === '/') {
			if (this.options.externalUrl) {
				request.url = this.options.externalUrl + request.url;
			}
		}

		return request;
	}.bind(this);

	// Append on fluky
	this.request = {
		get: function(url) {
			return request.get(url).use(prefix);
		},
		post: function(url) {
			return request.post(url).use(prefix);
		}
	};
};
