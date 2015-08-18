var React = require('react');
var Fluky = require('fluky');
var App = require('./app.jsx');

Fluky.setInitialState({
	User: {}
});

module.exports = App;
