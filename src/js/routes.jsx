var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App.jsx');
var LandingPage = require('./components/LandingPage.jsx');
var SignInPage = require('./components/SignInPage.jsx');
/*
var ArticleList = require('./components/ArticleList.jsx');
var Article = require('./components/Article.jsx');
*/
var Route = Router.Route;

var routes = (
	<Route name='app' path='/' handler={App}>
		<Route name='signin' path='/signin' handler={SignInPage}/>
		<DefaultRoute name='default' handler={LandingPage}/>
	</Route>
);
//		<Route name='article' path='/article/:id' handler={Article}/>
//		<DefaultRoute name='default' handler={ArticleList}/>

module.exports = routes;
