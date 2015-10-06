import React from 'react';
import Fluky from 'fluky';

class I18n extends React.Component {
	static propTypes = {
		sign: React.PropTypes.string,
		args: React.PropTypes.array
	};

	static getMessage = (...args) => {
		return Fluky.locale.getMessage.apply(this, args);
	}

	static getFmtMessage = (...args) => {
		return Fluky.locale.getFmtMessage.apply(this, args);
	}

	render() {
		var msg = '';

		// Convert to pure HTML if it contains react components
		var children = [];
		if (Array.isArray(this.props.children)) {
			children = [];

			for (var index in this.props.children) {
				var child = this.props.children[index];

				if (typeof child === 'string')
					children.push(child);
				else
					children.push(React.renderToString(child));
			}
		} else {
			children.push(this.props.children);
		}

		if (!this.props.args) {
			msg = Fluky.locale.getMessage(this.props.sign, children.join('')); 
		} else {
			var args = [ this.props.sign, children.join('') ].concat(this.props.args);
			msg = Fluky.locale.getFmtMessage.apply(this, args); 
		}

		return (
			<span dangerouslySetInnerHTML={{ __html: msg }} />
		);
	}
}

export default I18n;
