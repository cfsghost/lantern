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

function handleActions(Component, props, context, pre) {
	var actions = (pre) ? Component.preActions : Component.postActions;
	if (!actions)
		actions = [];

	// Pre-calling actions to fetch stores
	for (var index in actions) {
		var action = actions[index];

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

function wait(Component, props, context) {

	if (!Component.wait)
		return false;

	// Gettin all of updates of states we want to wait for
	var ref = Component.wait.length;
	for (var index in Component.wait) {
		var state = 'state.' + Component.wait[index];
		var handler = function *() {

			// handle it for once
			context.flux.off(state, handler);

			ref--;

			if (ref)
				return;

			// End of waiting
			handleActions(Component, props, context, false);
			context.flux.dispatch('action.Lantern.removeComponentRef');
		};

		context.flux.on(state, handler);
	}

	return ref ? true : false;
}

export default function(Component) {

	return class Initializer extends React.Component {
		static isInitializer = true;
		static component = Component;
		static contextTypes = {
			flux: React.PropTypes.object,
			router: React.PropTypes.object
		};

		constructor(props, context) {
			super(props, context);

			this.ready = true;

			// Do not fetch data twice
			if (!context.flux.disabledEventHandler && !context.flux.isBrowser) {
				
				context.flux.dispatch('action.Lantern.addComponentRef');

				// Setup listeners to wait for state updating
				var ret = wait(Initializer.component, props, context);

				// handle actions
				handleActions(Initializer.component, props, context, true);

				// No need to wait any state, so just complete initialization work
				if (!ret) {
					handleActions(Initializer.component, props, context, false);
					context.flux.dispatch('action.Lantern.removeComponentRef');
				}
			}
		}

		componentDidMount() {

			// Making a proxy for methods of component
			for (var method in this.refs.component) {

				switch(method) {
				case 'render':
				case 'componentWillMount':
				case 'componentDidMount':
				case 'componentWillUnmount':
				case 'componentWillReceiveProps':
				case '_reactInternalInstance':
				case 'isReactComponent':
				case 'state':
				case 'setState':
				case 'forceUpdate':
				case 'props':
				case 'context':
				case 'refs':
				case 'updater':
					continue;
				}

				(function(self, method) {
					Object.defineProperty(self, method, {
						get: function() {
							return self.refs.component[method];
						},
						set: function(value) {
							self.refs.component[method] = value;
						}
					});
				})(this, method);
			}

			if (this.props.route)
				this.context.router.setRouteLeaveHook(this.props.route, this.onPageLeave);

			// do not execute again if it's done on server-side
			if (!this.ready) {
				this.preAction(Initializer);
			}
		}

		onPageLeave = (nextLocation) => {

			// Show something before leaving
			if (this.refs.component.onLeave)
				return this.refs.component.onLeave(nextLocation);

			this.ready = false;
		};

		componentDidUpdate() {

			// do preAction if router is using the same component to reload page
			if (!this.ready) {
				this.preAction(Initializer);
			}
		}

		preAction = (Initializer) => {
			this.ready = true;
			this.context.flux.dispatch('action.Lantern.addComponentRef');

			// Setup listeners to wait for state updating
			var ret = wait(Initializer.component, this.props, this.context);

			// handle actions
			handleActions(Initializer.component, this.props, this.context, true);

			// No need to wait any state, so just complete initialization work
			if (!ret) {
				handleActions(Initializer.component, this.props, this.context, false);
				this.context.flux.dispatch('action.Lantern.removeComponentRef');
			} else {
				this.context.flux.on('action.Lantern.rendered', this.onLanternRendered);
			}
		};

		onLanternRendered = () => {
			this.context.flux.off('action.Lantern.rendered', this.onLanternRendered);
			this.forceUpdate();
		};

		componentWillUnmount() {
			this.context.flux.off('action.Lantern.rendered', this.onLanternRendered);
		}

		render() {
			return (
				<Initializer.component ref='component' {...this.props} />
			);
		}
	};
};
