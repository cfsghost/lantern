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

class Avatar extends React.Component {
	static propTypes = {
		hash: React.PropTypes.string,
		size: React.PropTypes.number
	};

	static defaultProps = {
		hash: null,
		size: 200
	};

	render() {

		if (this.props.size == -1) {
			var style = {
				width: '100%'
			};

			return (
				<img
					src={'https://secure.gravatar.com/avatar/' + this.props.hash + '?s=' + 256 + '&d=mm'}
					style={style}
					className='ui avatar image' />
			);
		}

		var requestSize = nearestSize(this.props.size);

		return (
			<img
				src={'https://secure.gravatar.com/avatar/' + this.props.hash + '?s=' + requestSize  + '&d=mm'}
				width={this.props.size}
				height={this.props.size}
				className='ui avatar image' />
		);
	}
}

export default Avatar;
