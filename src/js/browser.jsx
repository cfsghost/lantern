var React = require('react');
var Fluky = require('fluky');
var Router = require('react-router');
var App = require('./app.jsx');

require('../less/theme.less');

// Rendering immediately
Router.run(App, Router.HistoryLocation, function(Handler) {
	React.render(<Handler />, document.body);
});
