import React from 'react';

export default function(target) {

	target.prototype.__defineGetter__('i18n', function() {
		return this.context.flux.locale;
	});
};
