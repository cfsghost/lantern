import React from 'react';

// Extension Component
import Window from 'Extension/Window.jsx';

// Decorators
import { flux } from 'Decorator';

@flux
class App extends React.Component {
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
