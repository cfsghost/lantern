var LandingPage = require('./components/LandingPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');
var SignUpPage = require('./components/SignUpPage.jsx');
var SettingsPage = require('./components/SettingsPage.jsx');
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
	},
	{
		path: '/signup',
		handler: SignUpPage
	},
	{
		path: '/settings',
		redirect: '/settings/profile'
	},
	{
		path: '/settings/:category',
		handler: SettingsPage
	}
];
