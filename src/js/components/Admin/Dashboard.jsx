import React from 'react';
import Fluky from 'fluky';

class Dashboard extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			busy: false,
			error: false,
			name: '',
			email: ''
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
		Fluky.dispatch('action.User.syncProfile');
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	onChange = () => {
	}

	render() {
		var emailClasses = 'field';
		var nameClasses = 'required field';
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

		return (
			<div className='ui padded basic segment'>
				<div className='ui form'>
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
										Lantern
									</div>
									<div className='item'>
										<div className='ui red horizontal teal label'>External URL</div>
										http://localhost:3001
									</div>
								</div>
							</div>
						</div>

						<div className='four wide computer eight wide tablet column'>
							<div className='ui padded blue segment'>
								<div className='ui big statistic'>
									<div className='value'>
										<i className='users icon' />
										1000
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
										1000
									</div>
									<div className='label'>Admins</div>
								</div>
							</div>

						</div>
					</div>

				</div>
			</div>
		);
	}
}

export default Dashboard;
