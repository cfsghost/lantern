module.exports = [
	{
		path: '/404',
		handler: require('./components/NotFoundPage.jsx')
	},
	{
		path: '/',
		handler: require('./components/LandingPage.jsx')
	},
	{
		path: '/signin',
		handler: require('./components/SignInPage.jsx')
	},
	{
		path: '/forgot',
		handler: require('./components/ForgotPage.jsx')
	},
	{
		path: '/reset_password/:userid/:token',
		handler: require('./components/ResetPasswordPage.jsx')
	},
	{
		path: '/signup',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/SignUpPage.jsx'));
			});
		}
	},
	{
		path: '/signup_setup',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/SignUpSetupPage.jsx'));
			});
		}
	},
	{
		path: '/settings',
		redirect: '/settings/profile'
	},
	{
		path: '/settings/:category',
		handler: require('./components/SettingsPage.jsx')
	},
	{
		allow: 'admin.access',
		path: '/admin',
		redirect: '/admin/dashboard'
	},
	{
		allow: 'admin.access',
		path: '/admin/dashboard',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Dashboard.jsx'));
			});
		}
	},
	{
		allow: 'admin.users',
		path: '/admin/users',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Users.jsx'));
			});
		}
	},
	{
		allow: 'admin.users',
		path: '/admin/users/user/:userid',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/User.jsx'));
			});
		}
	},
	{
		allow: 'admin.roles',
		path: '/admin/roles',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Roles.jsx'));
			});
		}
	},
	{
		allow: 'admin.roles',
		path: '/admin/roles/role/:roleid',
		getHandler: function(nextState, done) {
			require.ensure([], function(require) {
				done(null, require('./components/Admin/Role.jsx'));
			});
		}
	}
];
