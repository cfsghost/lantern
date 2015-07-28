var React = require('react');
var Link = require('react-router').Link;

var nodejsLogo = require('../../images/nodejs-logo.png');
var webpackLogo = require('../../images/webpack-logo.png');
var koaLogo = require('../../images/koa-logo.png');
var reactLogo = require('../../images/react-logo.png');

var caseIcon = require('../../images/case-icon.png');

var descStyle = {
	fontSize: '1.5em'
};

var LandingPage = React.createClass({
	render: function () {
		return (
			<div>
				<div className={'ui basic center aligned segment landing-page-header'}>
					<h1 className={'ui inverted header'}>
						<span>Lantern</span>
						<h2 className={'ui inverted header'}>Isomorphic WebApp Template<br /> with Node.js, Koa, React and Webpack.</h2>
					</h1>
					<br />
					<button className={'massive ui inverted button'}>What's this</button>
				</div>
				<div className={'ui basic center aligned very padded segment'}>
					<div className={'ui two column grid'}>
						<div className={'column'}>
							<div className={'ui basic very padded left aligned segment'}>
								<h1>Web Application Template</h1>
								<p style={descStyle}>An isomorphic web application with modern technologies which can be used to create your project.</p>
							</div>
						</div>
						<div className={'column'}>
							<img src={caseIcon} className={'ui large centered image'} />
						</div>
					</div>

					<div className={'ui section divider'}></div>

					<div className={'ui four column grid'}>

						<div className={'column'}>
							<img className={'ui small image'} src={nodejsLogo} />
						</div>

						<div className={'column'}>
							<img className={'ui small image'} src={webpackLogo} />
						</div>

						<div className={'column'}>
							<img className={'ui small image'} src={koaLogo} />
						</div>

						<div className={'column'}>
							<img className={'ui small image'} src={reactLogo} />
						</div>
					</div>
				</div>
			</div>
		);
	}
});
//					<img src='https://download.unsplash.com/photo-1433840496881-cbd845929862' />

module.exports = LandingPage;
