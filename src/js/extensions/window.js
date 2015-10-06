export default function *() {

	var store = this.getState('Window', {
		width: 100,
		height: 100
	});

	this.on('store.Window.resize', function *(width, height) {
		var store = this.getState('Window');

		store.width = width;
		store.height = height;

		this.dispatch('store.Window', 'change');
	});

};
