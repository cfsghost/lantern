import util from 'util';
import co from 'co';

export default function *() {

	var Locale = this.getState('Localization', {
		currentLocale: 'en',
		currentMessage: {},
		messages: {}
	});

	var ctx = this;

	var setLocale = function(locale) {
		var state = ctx.setState('Localization');

		co(function *() {
			if (!state.messages[locale]) {
				// Getting translation
				var res = yield ctx.request
					.get('/lang/' + locale)
					.query();

				state.messages[locale] = res.body;
			}

			state.currentMessage = state.messages[locale] || {};

			ctx.dispatch('store.Localization', 'change');
		});
	};

	var getMessage = function(id, defaultStr) {
		return Locale.currentMessage[id] || defaultStr;
	};

	var getFmtMessage = function(id, defaultStr) {
		if (arguments.length < 2) {
			return '';
		}

		var fmt = Locale.currentMessage[id] || defaultStr;
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		args[0] = fmt;

		return util.format.apply(this, args);
	};

	this.locale = {
		setLocale: setLocale,
		getMessage: getMessage,
		getFmtMessage: getFmtMessage
	};
};
