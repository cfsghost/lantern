import Initializer from './initializer';
import flux from './flux';

export default function() {
	var args = Array.prototype.slice.apply(arguments);

	return function(Component) {
		flux(Component);

		if (!Component.isInitializer) {
			// Define what action this component required after created
			Component.postActions = args;

			return Initializer(Component);
		} else {
			// Define what action this component required after created

			if (!Component.component.postActions)
				Component.component.postActions = [];

			Component.component.postActions = Component.component.postActions.concat(args);
		}
	};
};
