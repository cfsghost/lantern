import React from 'react';
import Fluky from 'fluky';

class Window extends React.Component {

	componentDidMount() {
		if (!Fluky.isBrowser)
			return;

		window.addEventListener('resize', this.updateDimensions);

		Fluky.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	componentWillUnmount() {
		if (!Fluky.isBrowser)
			return;

		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		Fluky.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	render() {
		return <div />;
	}
}

export default Window;
