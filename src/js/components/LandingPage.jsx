import React from 'react';
import Fluky from 'fluky';
import Header from './Header.jsx';
import I18n from './I18n.jsx';

// Section image
import appIcon from 'Source/images/app-icon.png';
import techIcon from 'Source/images/tech-icon.png';

// Avatar
import avatar1 from 'Source/images/avatar-1.png';
import avatar2 from 'Source/images/avatar-2.png';
import avatar3 from 'Source/images/avatar-3.png';

var descStyle = {
	fontSize: '1.5em'
};

var sectionStyle = {
};

class LandingPage extends React.Component {

	about = () => {
		var $node = $(this.refs.app_section.getDOMNode());
		var $header = $(React.findDOMNode(this.refs.header));

		$('html, body').stop().animate({
			scrollTop: $node.offset().top - $header.height()
		}, 400);
	}

	render() {
		return (
			<div className='main-page'>
				<Header ref='header' />

				<div className={'ui basic center aligned segment landing-page-header'}>
					<h1 className={'ui inverted header'}>
						<span>{Fluky.getState('Service').name}</span>
						<h2 className={'ui inverted header'}>
							<I18n sign='landing_page.subtitle'>Isomorphic WebApp Template<br /> with ES6, Node.js, Koa, React and Webpack.</I18n>
						</h2>
					</h1>
					<br />
					<button className={'massive ui inverted button'} onClick={this.about}>
						<I18n sign='landing_page.entry_button'>What's this</I18n>
					</button>
				</div>
	
				<section style={sectionStyle} ref='app_section'>
					<div className={'ui basic center aligned very padded segment'}>
						<div className={'ui two column middle aligned stackable grid'}>
							<div className={'mobile only column'}>
								<img src={appIcon} className={'ui centered image'} />
							</div>
							<div className={'column'}>
								<div className={'ui basic left aligned segment'}>
									<h1>
										<I18n sign='landing_page.app_section.title'>Make Web Application Quicker</I18n>
									</h1>
									<p style={descStyle}>
										<I18n sign='landing_page.app_section.desc'>Lantern is a template that helps creating an isomorphic web application with modern technologies.</I18n>
									</p>
								</div>
							</div>
							<div className={'tablet only computer only column'}>
								<img src={appIcon} className={'ui large centered image'} />
							</div>
						</div>

					</div>
				</section>

				<section style={sectionStyle}>
					<div className={'ui basic aligned very padded segment'}>
						<div className={'ui two column middle aligned stackable grid'}>
							<div className={'column'}>
								<img src={techIcon} className={'ui large centered image'} />
							</div>
							<div className={'column'}>
								<div className={'ui basic left aligned segment'}>
									<h1>
										<I18n sign='landing_page.tech_section.title'>Modern Technologies</I18n>
									</h1>
									<p style={descStyle}>
										<I18n sign='landing_page.tech_section.desc'>Lantern is using ES6, Node.js, Koa, React, Semantic UI and Webpack.</I18n>
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section style={sectionStyle}>
					<div className={'ui basic very padded inverted segment'}>
						<div className={'ui three column divided inverted stackable grid'}>

							<div className={'middle aligned column'}>
								<div className={'ui basic center aligned segment'}>
									<h2 className={'ui center aligned inverted icon header'}>
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
									<h2 className={'ui center aligned inverted icon header'}>
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
									<h2 className={'ui center aligned inverted icon header'}>
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

export default LandingPage;
