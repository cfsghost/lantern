
export default function *() {

	this.on('store.User.signIn', function *() {
		console.log('store.User.signIn');
	});
};
