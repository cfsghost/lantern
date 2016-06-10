var React = require('react');

var sizes = [
	16,
	32,
	64,
	96,
	128,
	256
];

function nearestSize(size) {
	for (var index in sizes) {
		if (size < sizes[index])
			return sizes[index];
	}

	return sizes[sizes.length - 1];
}

function getGravatar(hash, size) {
	return 'https://secure.gravatar.com/avatar/' + hash + '?s=' + size + '&d=mm';
}

function getAvatarUrl(userId, hash, size) {
	if (userId)
		return '/avatar/' + userId + '.png?' + Date.now();
	else
		return getGravatar(hash, size);
}

class Avatar extends React.Component {

	static defaultProps = {
		userId: null,
		hash: null,
		size: 200
	};

	render() {
		var style = {
			display: 'inline-block',
			marginRight: '.25em'
		};

		if (this.props.size == -1) {
			style.width = '100%';

			var url = getAvatarUrl(this.props.userId, this.props.hash, 256);

			return (
				<img
					src={url}
					style={style}
					className='ui circular image' />
			);
		}

		var requestSize = nearestSize(this.props.size);
		var url = getAvatarUrl(this.props.userId, this.props.hash, requestSize);

		return (
			<img
				src={url}
				width={this.props.size}
				height={this.props.size}
				style={style}
				className='ui circular image' />
		);
	}
}

export default Avatar;
