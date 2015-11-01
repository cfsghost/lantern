import flux from './flux';

export default function(target) {
	flux(target);

	target.prototype.__defineGetter__('loader', function() {
		return this.context.flux.loader;
	});
};
