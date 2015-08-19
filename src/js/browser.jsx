var React = require('react');
var Fluky = require('fluky');
var App = require('./app.jsx');

if (window.Fluky) {
	Fluky.setInitialState(window.Fluky.state);
}

require('../less/theme.less');

// Rendering immediately
React.render(<App />, document.body);
