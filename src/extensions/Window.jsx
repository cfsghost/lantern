import React from 'react';

// Decorators
import { flux } from 'Decorator';

@flux
class Window extends React.Component {

	componentDidMount() {
		if (!this.flux.isBrowser)
			return;

		window.addEventListener('resize', this.updateDimensions);

		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	componentWillUnmount() {
		if (!this.flux.isBrowser)
			return;

		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	render() {
		return <div />;
	}
}

export default Window;
