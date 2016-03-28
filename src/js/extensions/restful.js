import RestPack from 'restpack';

export default function *() {

	this.restful = {
		Status: RestPack.Status,
		Code: RestPack.Code,
		parse: function(statusCode, data) {
			return new RestPack(statusCode, data);
		}
	};
};
