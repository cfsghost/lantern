import postAction from './postaction';

export default function(page) {

	return function(Component) {

		var pageInit = (handle) => {

			var _page = page;
			if (page instanceof Function) {
				_page = page(handle);
			}

			if (_page.hasOwnProperty('redirect')) {
				handle.flux.dispatch('action.Lantern.redirectUrl', _page.redirect);
				return;
			}

			// Setup window title
			if (_page.hasOwnProperty('title'))
				handle.doAction('Window.setTitle', _page.title);

			if (_page.hasOwnProperty('ogMeta')) {
				handle.doAction('Window.setOGMetaProperties', _page.ogMeta);
			}

		};

		var _do = postAction(pageInit);

		return _do(Component);
	}
};
