export default function *() {

	var store = this.getState('Lantern', {
		componentRef: 0
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
