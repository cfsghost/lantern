var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;
var Fluky = require('fluky');

class Header extends React.Component {

	constructor() {
		super();

		this.state = {
			logined: false,
			username: null,
			email: null
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentDidUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	onChange = () => {

		Fluky.dispatch('store.User.getState', function(user) {
			this.setState({
				logined: user.logined || false,
				username: user.username || null,
				email: user.email || null
			});
		}.bind(this));
	}

	render() {
		return (
			<div className={'ui top fixed inverted menu'}>
				<Link href='/'>
					<div className={'item'}>Lantern</div>
				</Link>
				<div className={'right menu'}>
					<Link href='/signin'>
						<div className={'item'}>
							<i className={'sign in icon'} />
							Sign In
						</div>
					</Link>
				</div>
			</div>
		);
	}
};

module.exports = Header;
