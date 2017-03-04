import Fluky from 'fluky';

if (Fluky.isBrowser) {
	require('./kalendae.css');
	require('./kalendae.min.js');
}

export default {
	name: 'DateRangePicker'
};
