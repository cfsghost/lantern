import React from 'react';

// Decorators
import { flux } from 'Decorator';

@flux
class Loader {

	static css = (...args) => {
		return this.flux.loader.css.apply(this, args);
	}

	static script = (...args) => {
		return this.flux.loader.script.apply(this, args);
	}
}

export default Loader;
