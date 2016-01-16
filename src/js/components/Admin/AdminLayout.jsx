import React from 'react';

// Components
import Header from '../Header.jsx';
import AdminMenu from './AdminMenu.jsx';

// Decorators
import { router, flux, i18n, store } from 'Decorator';

@flux
@i18n
class AdminLayout extends React.Component {

	constructor(props, context) {
		super(props, context);
	}

	componentWillMount = () => {
		this.flux.on('state.User', this.flux.bindListener(this.onChange));
	};

	componentWillUnmount = () => {
		this.flux.off('state.User', this.onChange);
	};

	onChange = () => {
	};

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
