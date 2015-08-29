import React from 'react';
import Fluky from 'fluky';

import Header from '../Header.jsx';
import AdminMenu from './AdminMenu.jsx';
import Dashboard from './Dashboard.jsx';
import Users from './Users.jsx';

class AdminRouter extends React.Component {

	render() {
		if (this.props.category == 'dashboard')
			return <Dashboard />

		if (this.props.category == 'users')
			return <Users />

		return <div />;
	}
}

class AdminPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.func.isRequired
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
		return (
			<div className='main-page'>
				<Header />
				<div className={'ui basic segment'}>
					<div className='ui hidden divider'></div>
					<div className='ui hidden divider'></div>
					<div className='ui stackable grid'>
						<div className='computer only four wide column'>
							<AdminMenu category={this.context.router.getCurrentParams().category} />
						</div>

						<div className='twelve wide computer sixteen wide tablet column'>
							<AdminRouter category={this.context.router.getCurrentParams().category} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminPage;
