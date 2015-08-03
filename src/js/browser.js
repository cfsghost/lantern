var React = require('react');
var Router = require('react-router');
var Routr = require('./routes.jsx');

require('../less/theme.less');

React.render(<Routr />, document.body);
/*
Router.run(routes, Router.HistoryLocation, function(Handler, state) {
	React.render(<Handler/>, document.body);
});
*/
