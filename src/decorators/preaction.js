import Initializer from './initializer';

export default function() {
	var args = Array.prototype.slice.apply(arguments);

	return function(Component) {

		if (!Component.isInitializer) {
			// Define what action this component required
			Component.preActions = args;

			return Initializer(Component);
		} else {
			// Define what action this component required

			if (!Component.component.preActions)
				Component.component.preActions = [];

			Component.component.preActions = Component.component.preActions.concat(args);
		}
	};
};
