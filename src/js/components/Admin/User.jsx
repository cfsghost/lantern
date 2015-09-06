import React from 'react';
import Fluky from 'fluky';

import AdminLayout from './AdminLayout.jsx';

class User extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = Fluky.getState('Admin.User');

		this.state = {
		};
	}

	componentWillMount = () => {
		Fluky.on('store.Admin.User', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.Admin.Users.query');
	}

	componentWillUnmount = () => {
		Fluky.off('store.Admin.User', this.onChange);
	}

	onChange = () => {
		var state = Fluky.getState('Admin.User');

		this.setState({
		});
	}

	render() {

		return (
			<AdminLayout category='users'>
				<div className='ui padded basic segment'>
					<h1 className='ui header'>
						<i className='users icon' />
						<div className='content'>
							Users
							<div className='sub header'>User management</div>
						</div>
					</h1>
				</div>
			</AdminLayout>
		);
	}
}

export default User;
