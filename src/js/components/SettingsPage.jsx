var React = require('react');
//var { Locations, Location, Link } = require('react-router-component');
var Fluky = require('fluky');

var Header = require('./Header.jsx');
var ProfileMenu = require('./ProfileMenu.jsx');
var UserProfile = require('./UserProfile.jsx');

class SettingsRouter extends React.Component {

	static propTypes = {
		category: React.PropTypes.string
	};

	static contextTypes = {
		path: React.PropTypes.string,
		router: React.PropTypes.object
	};

	render() {
		switch(this.props.category) {
		case 'profile':
			return <UserProfile />;
		}
	}
}

class SettingsPage extends React.Component {

	static contextTypes = {
		path: React.PropTypes.string,
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

		this.context.router.navigate('/');
		console.log(this.context.router);

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
						</div>
					</div>
				</div>
			</div>
		);
	}
	/*
							<Locations path={this.context.path}>
								<Location path='/settings/:category' handler={SettingsRouter} />
							</Locations>
*/
							}

module.exports = SettingsPage;
