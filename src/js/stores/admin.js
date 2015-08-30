export default function *() {

	// Initializing user store if state doesn't exist
	if (!this.state.Admin)
		this.state.Admin = {};
};
