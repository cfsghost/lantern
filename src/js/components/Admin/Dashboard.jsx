import React from 'react';
import AdminLayout from './AdminLayout.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@flux
@i18n
@preAction('Admin.Dashboard.query')
class Dashboard extends React.Component {

	constructor(props, context) {
		super(props, context);

		var state = this.flux.getState('Admin.Dashboard');

		this.state = {
			busy: false,
			error: false,
			serviceName: state.service.name,
			externalURL: state.service.externalURL,
			userCount: state.user.count,
			adminCount: state.admin.count
		};
	}

	componentWillMount = () => {
		this.flux.on('state.Admin.Dashboard', this.flux.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		this.flux.off('state.Admin.Dashboard', this.onChange);
	}

	onChange = () => {
		var state = this.flux.getState('Admin.Dashboard');

		this.setState({
			serviceName: state.service.name,
			externalURL: state.service.externalURL,
			userCount: state.user.count,
			adminCount: state.admin.count
		});
	}

	render() {

		return (
			<AdminLayout category='dashboard'>
				<div className='ui padded basic segment'>
					<h1 className='ui header'>
						<i className='dashboard icon' />
						<div className='content'>
							Dashboard
							<div className='sub header'>Service information</div>
						</div>
					</h1>

					<div className='ui stackable grid'>
						<div className='eight wide computer sixteen wide tablet column'>
							<div className='ui padded red segment'>
								<div className='ui divided selection list'>
									<div className='item'>
										<div className='ui red horizontal blue label'>Service Name</div>
										{this.state.serviceName}
									</div>
									<div className='item'>
										<div className='ui red horizontal teal label'>External URL</div>
										{this.state.externalURL}
									</div>
								</div>
							</div>
						</div>

						<div className='four wide computer eight wide tablet column'>
							<div className='ui padded blue segment'>
								<div className='ui big statistic'>
									<div className='value'>
										<i className='users icon' />
										{this.state.userCount}
									</div>
									<div className='label'>Users</div>
								</div>
							</div>
						</div>

						<div className='four wide computer eight wide tablet column'>

							<div className='ui padded yellow segment'>
								<div className='ui big statistic'>
									<div className='value'>
										<i className='spy icon' />
										{this.state.adminCount}
									</div>
									<div className='label'>Admins</div>
								</div>
							</div>

						</div>
					</div>

				</div>
			</AdminLayout>
		);
	}
}

export default Dashboard;
