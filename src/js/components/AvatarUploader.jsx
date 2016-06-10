import React from 'react';
import ReactDOM from 'react-dom';
import I18n from 'Extension/I18n.jsx';

// Components
import Avatar from './Avatar.jsx';

// Decorators
import { router, flux, i18n, preAction } from 'Decorator';

@flux
class AvatarUploader extends React.Component {

	componentDidMount() {
		var self = this;
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext('2d');
		var $button = $(this.refs.button);
		var $progress = $(this.refs.progress);

		$progress.progress();

		$(this.refs.avatar).on('change', function() {
			$button.addClass('loading disabled button');

			if (this.files && this.files[0]) {

				// Check format type
				if (this.files[0].type != 'image/png' &&
					this.files[0].type != 'image/jpeg') {
					return;
				}

				// Read specific file
				var reader = new FileReader();
				reader.onload = function(e) {

					// Loading image
					var img = new Image();
					img.onload = function() {

						$(self.refs.old_avatar).hide();
						$(self.refs.preview_avatar).show();
						$progress.show();

						// Draw image on canvas
						ctx.clearRect(0, 0, 256, 256);
						ctx.drawImage(img, 0, 0, 256, 256);

						// Uploading
						$.ajax({
							url: '/apis/user/self/avatar',
							type: 'PUT',
							data: {
								data: canvas.toDataURL('image/png')
							},
							xhrFields: {
								onprogress: function(event) {
									if (event.lengthComputable) {
										$progress.progress({
											total: event.total,
											value: event.loaded
										});
									}
								}
							}
						}).success(function() {
							$button.removeClass('loading disabled');
							$progress.hide();

							self.flux.dispatch('action.User.updateAvatar', {
								avatar: true
							});
						});
					};
					img.src = e.target.result;
				};
				reader.readAsDataURL(this.files[0]);
			}
		});
	}

	selectAvatar = () => {
		if ($(this.refs.button).hasClass('disabled'))
			return;

		$(this.refs.avatar).show().trigger('click').hide();
	};

	resizeImage = () => {
		var ctx = this.refs.canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
	};

	render() {
		var canvasStyle = {
			borderRadius: this.props.size + 'px',
			width: this.props.size + 'px',
			height: this.props.size + 'px'
		};

		return (
			<div className='ui center aligned basic segment'>

				<div ref='preview_avatar' style={{ display: 'none' }} className='ui center aligned basic segment'>
					<canvas ref='canvas' style={canvasStyle} width='256' height='256' />
				</div>

				<div ref='old_avatar' className='ui center aligned basic segment'>
					<Avatar userId={this.props.internalAvatar ? this.props.userId : null} hash={this.props.defaultHash} size={this.props.size} />
				</div>

				<input
					type='file'
					ref='avatar'
					style={{ display: 'none' }}
					/>

				<button ref='button' className={'ui teal button'} onClick={this.selectAvatar}>
					<I18n sign='user_profile.upload_avatar_button'>Upload New Avatar</I18n>
					<div ref='progress' style={{ display: 'none' }} className='ui tiny active indicating progress'>
						<div className='bar'></div>
					</div>
				</button>
			</div>
		);
	}
}

export default AvatarUploader;
