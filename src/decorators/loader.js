import React from 'react';

export default function(target) {

	target.prototype.__defineGetter__('loader', function() {
		return this.context.flux.loader;
	});
};
