import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import { Button } from "antd";
// import { Base64 } from "@/assets/audio/base64";

class AudioView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
		this.handlePlay = this.handlePlay.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.encode = this.encode.bind(this);
	}

	encode(input){
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = this._utf8_encode(input);
		while(i < input.length){
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)){
				enc3 = enc4 = 64;
			}
			else if(isNaN(chr3)){
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// private method for UTF-8 encoding
	_utf8_encode(string){
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for(var n = 0; n < string.length; n++){
			var c = string.charCodeAt(n);
			if(c < 128){
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)){
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else{
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	handlePlay(){
		const { url } = this.props;
		RongIMLib.RongIMVoice.play(this.encode(url));
	}

	handleStop(){
		RongIMLib.RongIMVoice.stop();
	}

	render(){

		return (
			<div>
				<Button onClick={ this.handlePlay }>播放</Button>
				<Button onClick={ this.handleStop }>暂停</Button>
			</div>
			// <div>
			// 	<audio
			// 		src={ url }
			// 		controls="controls"
			// 		preload="preload"
			// 	></audio>
			// </div>
		);

	}
}
const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(AudioView);
