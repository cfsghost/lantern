export default function *() {

	var store = this.getState('Window', {
		title: null,
		width: 100,
		height: 100,
		scrollTop: 0,
		ogMeta: {}
	});

	this.on('store.Window.setTitle', function *(title) {
		store.title = title;

		if (this.isBrowser)
			this.dispatch('state.Window');
	});

	this.on('store.Window.resize', function *(width, height) {
		var store = this.getState('Window');

		if (width == store.width && height == store.height)
			return;

		store.width = width;
		store.height = height;

		if (this.isBrowser)
			this.dispatch('state.Window');
	});

	this.on('store.Window.scroll', function *(scrollTop) {
		var store = this.getState('Window');

		store.scrollTop = scrollTop;

		if (this.isBrowser)
			this.dispatch('state.Window');
	});

	this.on('store.Window.setOGMetaProperties', function *(metadata) {
		store.ogMeta = metadata;

		if (this.isBrowser)
			this.dispatch('state.Window');
	});
};
