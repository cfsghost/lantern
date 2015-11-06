import React from 'react';

export default function(target) {

	var Component = target;
	if (target.isInitializer)
		Component = target.component;

	if (!Component.contextTypes)
		Component.contextTypes = {};

	Component.contextTypes.history = React.PropTypes.object;

	Component.prototype.__defineGetter__('history', function() {
		return this.context.history;
	});
};
