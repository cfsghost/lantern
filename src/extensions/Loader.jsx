import React from 'react';
import Fluky from 'fluky';

class Loader {

	static css = (...args) => {
		return Fluky.loader.css.apply(this, args);
	}

	static script = (...args) => {
		return Fluky.loader.script.apply(this, args);
	}
}

export default Loader;
