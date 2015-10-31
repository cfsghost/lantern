import React from 'react';

export default function(target) {
	if (!target.contextTypes)
		target.contextTypes = {};

	// Already exists
	if (target.contextTypes.flux)
		return;

	target.contextTypes.flux = React.PropTypes.object;

	target.prototype.__defineGetter__('flux', function() {
		return this.context.flux;
	});
};
