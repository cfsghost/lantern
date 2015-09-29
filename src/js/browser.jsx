import React from 'react';
import Fluky from 'fluky';
import Router from 'react-router';
import App from './app.jsx';

require('../less/theme.less');

// Rendering immediately
Router.run(App, Router.HistoryLocation, function(Handler) {
	React.render(<Handler />, document.body);
});
