var React = require('react');
var Link = require('react-router-component').Link;
var Fluky = require('fluky');

var Header = require('./Header.jsx');

class SignInPage extends React.Component {

	componentWillMount() {
	}

	signIn = () => {
		Fluky.dispatch('action.User.signIn',
			this.refs.email.getDOMNode().value,
			this.refs.password.getDOMNode().value);
	}

	render() {
		return (
			<div>
				<Header />
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className={'ui basic center aligned padded segment'}>

					<div className='ui two column centered grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='sign in icon' />
								<div className='content'>Sign In</div>
							</h1>
							<div className={'ui basic segment'}>
								<div className='ui form'>
									<div className='field'>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='email' name='email' placeholder='E-mail address' autoFocus={true} />
										</div>
									</div>
									<div className='field'>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' placeholder='Password' />
										</div>
									</div>
									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}>Sign In</button>
									</div>
									<div className='field ui teal message'>
										No Account yet? <Link href='/signup'>Sign Up</Link>
									</div>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		);
	}
}

module.exports = SignInPage;
