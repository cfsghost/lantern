var React = require('react');
var Header = require('./Header.jsx');

var nodejsLogo = require('../../images/nodejs-logo.png');
var webpackLogo = require('../../images/webpack-logo.png');
var koaLogo = require('../../images/koa-logo.png');
var reactLogo = require('../../images/react-logo.png');

// Section image
var caseIcon = require('../../images/case-icon.png');
var techIcon = require('../../images/tech-icon.png');

// Avatar
var avatar1 = require('../../images/avatar-1.png');
var avatar2 = require('../../images/avatar-2.png');
var avatar3 = require('../../images/avatar-3.png');

var descStyle = {
	fontSize: '1.5em'
};

var sectionStyle = {
	paddingTop: '4em',
	paddingBottom: '4em'
};

class LandingPage extends React.Component {
	render() {
		return (
			<div>
				<Header />

				<div className={'ui basic center aligned segment landing-page-header'}>
					<h1 className={'ui inverted header'}>
						<span>Lantern</span>
						<h2 className={'ui inverted header'}>Isomorphic WebApp Template<br /> with ES6, Node.js, Koa, React and Webpack.</h2>
					</h1>
					<br />
					<button className={'massive ui inverted button'}>What's this</button>
				</div>
	
				<section style={sectionStyle}>
					<div className={'ui basic center aligned very padded segment'}>
						<div className={'ui two column middle aligned grid'}>
							<div className={'column'}>
								<div className={'ui basic very padded left aligned segment'}>
									<h1>Make Web Application Quicker</h1>
									<p style={descStyle}>Lantern is a template that helps creating an isomorphic web application with modern technologies.</p>
								</div>
							</div>
							<div className={'column'}>
								<img src={caseIcon} className={'ui large centered image'} />
							</div>
						</div>

					</div>
				</section>

				<div className={'ui section divider'}></div>
				<section style={sectionStyle}>
					<div className={'ui basic aligned very padded segment'}>
						<div className={'ui two column middle aligned grid'}>

							<div className={'ui three column centered grid'}>

								<div className={'row'}>
									<div className={'column'}>
										<img className={'ui image'} src={nodejsLogo} />
									</div>

									<div className={'column'}>
										<img className={'ui image'} src={koaLogo} />
									</div>
								</div>

								<div className={'row'}>
									<div className={'column'}>
										<img className={'ui image'} src={webpackLogo} />
									</div>

									<div className={'column'}>
										<img className={'ui image'} src={reactLogo} />
									</div>
								</div>
							</div>

							<div className={'column'}>
								<div className={'ui basic very padded left aligned segment'}>
									<h1>Modern Technologies</h1>
									<p style={descStyle}>Lantern is using ES6, Node.js, Koa, React, Semantic UI and Webpack.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section style={sectionStyle}>
					<div className={'ui basic very padded segment'}>
						<div className={'ui three column divided grid'}>

							<div className={'middle aligned column'}>
								<div className={'ui basic center aligned segment'}>
									<h2 className={'ui center aligned icon header'}>
										<img className={'ui small circular image'} src={avatar1} />
										<br />
										<br />
										<div>Fred Chien</div>
										<div className={'sub header'}>Founder</div>
									</h2>
								</div>
							</div>

							<div className={'middle aligned column'}>
								<div className={'ui basic center aligned segment'}>
									<h2 className={'ui center aligned icon header'}>
										<img className={'ui small circular image'} src={avatar2} />
										<br />
										<br />
										<div>Leon Lin</div>
										<div className={'sub header'}>Founder</div>
									</h2>
								</div>
							</div>

							<div className={'middle aligned column'}>
								<div className={'ui basic center aligned segment'}>
									<h2 className={'ui center aligned icon header'}>
										<img className={'ui small circular image'} src={avatar3} />
										<br />
										<br />
										<div>Unknown</div>
										<div className={'sub header'}>Founder</div>
									</h2>
								</div>
							</div>
							
						</div>
					</div>
				</section>

				<div className={'ui basic inverted center aligned segment'}>
					<span>Copyright &copy; 2015 Lantern Project. All Rights Reserved.</span>
				</div>
			</div>
		);
	}
}

module.exports = LandingPage;
