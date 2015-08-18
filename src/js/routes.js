var LandingPage = require('./components/LandingPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');

module.exports = [
	{
		path: '/',
		handler: LandingPage
	},
	{
		path: '/signin',
		handler: SignInPage
	}
];
