import Initializer from './initializer';

function configure(target) {
	target.clientOnly = true;
}

export default function(target) {
	var Component = Initializer(target);
	configure(Component.component);

	return Component;
};
