import React from 'react';

// Extension Component
import Window from 'Extension/Window.jsx';

// Decorators
import { flux } from 'Decorator';

@flux
class App extends React.Component {
/*
	static childContextTypes = {
		path: React.PropTypes.string,
		router: React.PropTypes.object,
		flux: React.PropTypes.object
	};

	static defaultProps = {
		flux: React.PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
	}
*/
/*
	static contextTypes = {
		flux: React.PropTypes.object
	};
*/
	render() {
		return (
			<div>
				<Window />
				{this.props.children}
			</div>
		);
	}
};

export default App;
