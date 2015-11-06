import React from 'react';
import ReactDOM from 'react-dom';
import flux from './flux';

function doAllActions(flux, actions) {

	for (var action in actions) {

		args = actions[action];

		var _args = [ 'action.' + action ];
		if (args instanceof Array)
			_args = _args.concat(args);

		flux.dispatch.apply(flux, _args);
	}
}

function doAction() {

	var args = Array.prototype.slice.apply(arguments);

	if (args.length == 0)
		return;

	args[0] = 'action.' + args[0];
	this.flux.dispatch.apply(this.flux, args);
}

function handleActions(Component, props, context) {
	// Pre-calling actions to fetch stores
	for (var index in Component.preActions) {
		var action = Component.preActions[index];

		if (action instanceof Function) {
			action.call(Component, {
				props: props,
				i18n: context.flux.locale || undefined,
				flux: context.flux,
				doAction: doAction.bind({
					Component: Component,
					flux: context.flux
				})
			});
		} else if (typeof action === 'string') {
			context.flux.dispatch('action.' + action);
		} else if (action instanceof Object) {
			doAllActions(context.flux, action);
		}

	}
}

export default function() {
	var args = Array.prototype.slice.apply(arguments);

	return function(Component) {
		flux(Component);

		if (!Component.isInitializer) {
			// Define what store this component required
			Component.preActions = args;

			return class Initializer extends React.Component {
				static isInitializer = true;
				static component = Component;
				static contextTypes = {
					flux: React.PropTypes.object
				};

				constructor(props, context) {
					super(props, context);

					// Do not fetch data twice
					if (!context.flux.disabledEventHandler) {
						handleActions(Component, props, context);
					}
				}

				render() {
					return (
						<Component {...this.props} />
					);
				}
			};
		} else {
			// Define what store this component required
			Component.component.preActions = Component.component.preActions.concat(args);
		}
	};
};
