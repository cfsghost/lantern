var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;

class Header extends React.Component {
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
