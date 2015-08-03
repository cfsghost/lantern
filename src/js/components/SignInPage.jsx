var React = require('react');
var Link = require('react-router').Link;

var Header = require('./Header.jsx');

class SignInPage extends React.Component {
	render() {
		return (
			<div>
				<Header />
				<div className={'ui basic center aligned segment'}>
					<div className={'ui left icon input'}>
						<i className={'user icon'} />
						<input type='text' name='email' placeholder='E-mail address' />
					</div>
				</div>
			</div>
		);
	}
}

module.exports = SignInPage;
