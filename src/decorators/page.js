import postAction from './postaction';

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

			if (_page.ogMeta) {
				handle.doAction('Window.setOGMetaProperties', _page.ogMeta);
			}

		};

		var _do = postAction(pageInit);

		return _do(Component);
	}
};
