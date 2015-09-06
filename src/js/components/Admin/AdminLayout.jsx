import React from 'react';
import Fluky from 'fluky';

import Header from '../Header.jsx';
import AdminMenu from './AdminMenu.jsx';

class AdminLayout extends React.Component {

	static contextTypes = {
		router: React.PropTypes.func.isRequired
	};

	constructor(props, context) {
		super(props, context);
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
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
							<AdminMenu category={this.props.category} />
						</div>

						<div className='twelve wide computer sixteen wide tablet column'>
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminLayout;
