import React from 'react';

// Decorators
import { flux } from 'Decorator';

@flux
class Window extends React.Component {

	componentWillMount() {
		this.flux.on('state.Window', this.flux.bindListener(this.onChange));
	}

	componentDidMount() {
		if (!this.flux.isBrowser)
			return;

		window.addEventListener('resize', this.updateDimensions);

		window.onscroll = this.onScroll;

		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	}

	componentWillUnmount() {
		this.flux.off('state.Window', this.onChange);

		if (!this.flux.isBrowser)
			return;

		window.onscroll = null;
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.flux.dispatch('action.Window.resize', $(window).width(), $(window).height());
	};

	onScroll = () => {
		this.flux.dispatch('action.Window.scroll', document.body.scrollTop);
	};

	onChange = () => {

		if (!this.flux.isBrowser)
			return;

		var store = this.flux.getState('Window');

		document.title = store.title;

		// Remove open graph metadata
		$('head meta').each(function() {
			var $self = $(this);

			var property = $self.attr('property');
			if (!property)
				return;

			if (property.split[0] != 'og')
				return;

			$self.remove()

		});

		// setup open graph metadata
		for (var key in store.ogMeta) {
			var value = store.ogMeta[key];

			var $meta = $('<meta>').attr(key, value);
			$('head').append($meta);
		}
	};

	render() {
		return <div />;
	}
}

export default Window;
