var LandingPage = require('./components/LandingPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');
var NotFoundPage = require('./components/NotFoundPage.jsx');

module.exports = [
	{
		path: null,
		handler: NotFoundPage
	},
	{
		path: '/',
		handler: LandingPage
	},
	{
		path: '/signin',
		handler: SignInPage
	}
];
