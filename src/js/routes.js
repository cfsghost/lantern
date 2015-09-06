var LandingPage = require('./components/LandingPage.jsx');
var ForgotPage = require('./components/ForgotPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');
var SignUpPage = require('./components/SignUpPage.jsx');
var SettingsPage = require('./components/SettingsPage.jsx');
var NotFoundPage = require('./components/NotFoundPage.jsx');
var ResetPasswordPage = require('./components/ResetPasswordPage.jsx');

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
		path: '/forgot',
		handler: ForgotPage
	},
	{
		path: '/reset_password/:userid/:token',
		handler: ResetPasswordPage
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
	},
	{
		path: '/admin',
		redirect: '/admin/dashboard'
	},
	{
		path: '/admin/dashboard',
		handler: require('./components/Admin/Dashboard.jsx')
	},
	{
		path: '/admin/users',
		handler: require('./components/Admin/Users.jsx')
	},
	{
		path: '/admin/users/user/:userid',
		handler: require('./components/Admin/User.jsx')
	}
];
