var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;
var Fluky = require('fluky');

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
	}

	componentDidUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	onChange = () => {

		Fluky.dispatch('store.User.getState', function(user) {
			this.setState({
				user: user
			});
		}.bind(this));
	}

	render() {

		var loginState;
		if (this.state.user.logined) {
			loginState = (
				<div className={'item'}>
					<i className={'sign up icon'} />
					{this.state.user.name}
				</div>
			);
		} else {
			loginState = (
				<Link href='/signin'>
					<div className={'item'}>
						<i className={'sign in icon'} />
						Sign In
					</div>
				</Link>
			);
		}

		return (
			<div className={'ui top fixed inverted menu'}>
				<Link href='/'>
					<div className={'item'}>Lantern</div>
				</Link>
				<div className={'right menu'}>{loginState}</div>
			</div>
		);
	}
};

module.exports = Header;
