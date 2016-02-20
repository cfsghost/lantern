import React from 'react';
import { Link } from 'react-router';
import I18n from 'Extension/I18n.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

// Components
import LoginState from './LoginState.jsx';

@flux
@router
class Header extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			user: this.flux.getState('User'),
			service: this.flux.getState('Service')
		};
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
		this.flux.on('state.Service', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
		this.flux.off('state.Service', this.onChange);
	};

	onChange = () => {

		this.setState({
			user: this.flux.getState('User'),
			service: this.flux.getState('Service')
		});
	};

	render() {
		return (
			<div ref='component' className={'ui top fixed inverted menu'}>
				<Link to='/' className={'item'} activeClassName=''>
					<div>{this.state.service.name}</div>
				</Link>

				<div className={'right menu'}>
					<LoginState user={this.state.user} />
				</div>
			</div>
		);
	}
};

export default Header;
