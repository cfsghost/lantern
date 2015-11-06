export default function *() {

	var store = this.getState('Window', {
		title: null,
		width: 100,
		height: 100,
		scrollTop: 0
	});

	this.on('store.Window.setTitle', function *(title) {
		store.title = title;

		this.dispatch('state.Window');
	});

	this.on('store.Window.resize', function *(width, height) {
		var store = this.getState('Window');

		store.width = width;
		store.height = height;

		this.dispatch('state.Window');
	});

	this.on('store.Window.scroll', function *(scrollTop) {
		var store = this.getState('Window');

		store.scrollTop = scrollTop;

		this.dispatch('state.Window');
	});
};
