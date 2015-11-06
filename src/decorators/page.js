import preAction from './preaction';

export default function(page) {

	return function(Component) {

		var pageInit = (handle) => {

			var _page = page;
			if (page instanceof Function) {
				_page = page(handle);
			}

			// Setup window title
			if (_page.title)
				handle.doAction('Window.setTitle', _page.title);
		};

		var _do = preAction(pageInit);

		return _do(Component);
	}
};
