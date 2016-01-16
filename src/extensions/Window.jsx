import React from 'react';

// Decorators
import { flux } from 'Decorator';

@flux
class Window extends React.Component {

	componentWillMount() {
		this.flux.on('state.Window', this.flux.bindListener(this.onChange));
	}

	componentDidMount() {
		if (!this.flux.isBrowser)
			return;

		window.addEventListener('resize', this.updateDimensions);

		window.onscroll = this.onScroll;

		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	componentWillUnmount() {
		this.flux.off('state.Window', this.onChange);

		if (!this.flux.isBrowser)
			return;

		window.onscroll = null;
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	};

	onScroll = () => {
		this.flux.dispatch('action.Window.scroll', document.body.scrollTop);
	};

	onChange = () => {

		if (!this.flux.isBrowser)
			return;

		var store = this.flux.getState('Window');

		document.title = store.title;
	};

	render() {
		return <div />;
	}
}

export default Window;
