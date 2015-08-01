var React = require('react');
var Link = require('react-router').Link;

class SignInPage extends React.Component {
	render() {
		return (
			<div>
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
//					<img src='https://download.unsplash.com/photo-1433840496881-cbd845929862' />

module.exports = SignInPage;
