import flux from './flux';

export default function(target) {

	var Component = target;

	if (target.isInitializer) {
		Component = target.component;
	} else {
		flux(Component);
	}

	Component.prototype.__defineGetter__('i18n', function() {
		return this.context.flux.locale;
	});
};
