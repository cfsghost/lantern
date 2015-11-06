import preAction from './preaction';

export default function(page) {

	return function(Component) {

		var pageInit = (handle) => {
			if (page.title)
				handle.doAction('Window.setTitle', page.title);
		};

		var _do = preAction(pageInit);

		return _do(Component);
	}
};
