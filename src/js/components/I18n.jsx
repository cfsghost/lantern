import React from 'react';
import Fluky from 'fluky';

class I18n extends React.Component {
	static propTypes = {
		sign: React.PropTypes.string,
		args: React.PropTypes.array
	};

	render() {
		var msg = '';
		if (!this.props.args) {
			msg = Fluky.locale.getMessage(this.props.sign, this.props.children); 
		} else {
			var args = [ this.props.sign, this.props.children ].concat(this.props.args);
			msg = Fluky.locale.getFmtMessage.apply(this, args); 
		}

		return (
			<span dangerouslySetInnerHTML={{ __html: msg }} />
		);
	}
}

export default I18n;
