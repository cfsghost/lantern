import Initializer from './initializer';
import flux from './flux';

export default function() {
	var args = Array.prototype.slice.apply(arguments);

	return function(Component) {

		if (!Component.isInitializer) {
			// Define what state this component will be waiting for
			Component.wait = args;

			return Initializer(Component);
		} else {
			// Define what state this component will be waiting for
			if (!Component.component.wait)
				Component.component.wait = [];

			Component.component.wait = Component.component.wait.concat(args);
		}
	};
};
