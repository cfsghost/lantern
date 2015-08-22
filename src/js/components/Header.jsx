var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;
var Fluky = require('fluky');
var Avatar = require('./Avatar.jsx');

class Header extends React.Component {

	constructor() {
		super();

		this.state = {
			user: {
				logined: false
			}
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));

		// Get initial state
		Fluky.dispatch('store.User.getState', function(user) {
			this.setState({
				user: user
			});
		}.bind(this));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	onChange = () => {

		Fluky.dispatch('store.User.getState', function(user) {
			this.setState({
				user: user
			});
		}.bind(this));
	}

	componentDidUpdate() {
		// Enabling dropdown menu
		$('.ui.dropdown').dropdown({
			on: 'hover'
		});
	}

	render() {

		var loginState;
		if (this.state.user.logined) {
			loginState = (
				<div className={'right menu'}>
					<div className='ui dropdown item'>
						<span><Avatar hash={this.state.user.avatar_hash} size={20} /> <span>{this.state.user.name}</span></span>
						<i className='dropdown icon'></i>
						<div className='menu'>
							<a href='/profile' className='item'>
								<i className='settings icon'></i>
								Profile
							</a>
							<div className='ui fitted divider'></div>
							<a href='/signout' className='item'>
								<i className='sign out icon'></i>
								Sign Out
							</a>
						</div>
					</div>
				</div>
			);
		} else {
			loginState = (
				<div className={'right menu'}>
					<Link href='/signin'>
						<div className={'item'}>
							<i className={'sign in icon'} />
							Sign In
						</div>
					</Link>
				</div>
			);
		}

		return (
			<div className={'ui top fixed inverted menu'}>
				<Link href='/' className={'item'}>
					<div>Lantern</div>
				</Link>
				{loginState}
			</div>
		);
	}
};

module.exports = Header;
