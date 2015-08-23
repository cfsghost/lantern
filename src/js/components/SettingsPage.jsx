var React = require('react');
var Link = require('react-router-component').Link;
var Fluky = require('fluky');

var Header = require('./Header.jsx');
var ProfileMenu = require('./ProfileMenu.jsx');
var UserProfile = require('./UserProfile.jsx');

class SettingsPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	componentDidUpdate = () => {
//		$(this.refs.sidebar.getDOMNode()).sidebar();
	}

	onChange = () => {
	}

	render() {
		var emailClasses = 'required field';
		var nameClasses = 'required field';
		var passwordClasses = 'required field';
		var confirmClasses = 'required field';
		var message;
		var fieldClass = 'field';
		if (this.state.error) {
			fieldClass += ' error';
			message = (
				<div className='ui negative icon message'>
					<i className={'warning sign icon'} />
					<div className='content'>
						<div className='header'>Failed to Sign In</div>
						<p>Please check your email and password then try again</p>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className={'ui basic segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui grid'>
						<div className='computer only three wide column'>
							<ProfileMenu />
						</div>

						<div className='thirteen wide computer column'>
							<UserProfile />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = SettingsPage;
