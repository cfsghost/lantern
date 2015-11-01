import flux from './flux';

export default function(target) {
	flux(target);

	target.prototype.__defineGetter__('i18n', function() {
		return this.context.flux.locale;
	});
};
