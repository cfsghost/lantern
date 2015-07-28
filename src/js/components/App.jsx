var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var App = React.createClass({
  render: function () {
    return (
		<div>
			<div className={'ui top fixed inverted menu'}>
				<div className={'item'}>Lantern</div>
			</div>
			<section className={"content markdown-body"}>
				<RouteHandler/>
			</section>
		</div>
    );
  }
});
/*
        <header className={"cf"}>
          <h1>Lantern</h1>
          <nav>
            <ul>
              <li><Link to="app">Home</Link></li>
            </ul>
          </nav>
        </header>
      </div>
*/
//              <li><Link to="article" params={{id: 'about'}}>About</Link></li>

module.exports = App;
