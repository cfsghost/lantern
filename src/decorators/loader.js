import flux from './flux';

export default function(target) {

	var Component = target;
	if (target.isInitializer)
		Component = target.component;

	flux(Component);
	Component.prototype.__defineGetter__('loader', function() {
		return this.context.flux.loader;
	});
};
