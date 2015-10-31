import React from 'react';

class Entry extends React.Component {

	static defaultProps = {
		flux: React.PropTypes.object
	};

	static childContextTypes = {
		flux: React.PropTypes.object
	};

	getChildContext() {
		return {
			flux: this.props.flux
		};
	}

	render() {
		return this.props.children;
	}
}

export default Entry;
