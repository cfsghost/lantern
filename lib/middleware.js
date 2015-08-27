
module.exports = {
	requireAuthorized: function *(next) {
		if (!this.isAuthenticated()) {
			this.status = 404;
			return;
		}

		yield next;
	}
};
