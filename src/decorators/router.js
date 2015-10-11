import React from 'react';

export default function(target) {
	if (!target.contextTypes)
		target.contextTypes = {};

	target.contextTypes.history = React.PropTypes.object;

	target.prototype.__defineGetter__('history', function() {
		return this.context.history;
	});
};
