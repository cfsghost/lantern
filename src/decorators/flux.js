import React from 'react';

export default function(target) {
	var Component = target;
	if (target.isInitializer)
		Component = target.component;

	if (!Component.contextTypes)
		Component.contextTypes = {};

	if (!Component.contextTypes.flux)
		Component.contextTypes.flux = React.PropTypes.object;

	Component.prototype.__defineGetter__('flux', function() {
		return this.context.flux;
	});
};
