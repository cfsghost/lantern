export default function *() {

	var store = this.getState('Lantern', {
		redirect: null,
		inheritServerState: false,
		componentRef: 0
	});

	this.on('action.Lantern.redirectUrl', function *(url) {
		store.redirect = url;

		this.dispatch('action.Lantern.rendered');
	});

	this.on('action.Lantern.setInheritServerState', function *(state) {
		store.inheritServerState = state;

		this.dispatch('state.Lantern');
	});

	this.on('action.Lantern.addComponentRef', function *() {

		store.componentRef++;

		this.dispatch('state.Lantern');
	});

	this.on('action.Lantern.removeComponentRef', function *() {

		store.componentRef--;

		this.dispatch('state.Lantern');

		if (store.componentRef == 0) {
			// Fire in next loop
			setTimeout(function() {
				this.dispatch('action.Lantern.rendered');
			}.bind(this), 0);
		}
	});
};
