
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var store = this.getState('SignUp', {
		status: '',
		errors: []
	});

	this.on('action.SignUp.update', function *(info) {

		store.status = info.status || '';
		store.errors = info.errors || [];

		this.dispatch('state.SignUp');
	});
};
