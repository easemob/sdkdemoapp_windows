import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
var _const = require("@/views/common/domain");
var os = require("os");
import { localOrRemoteFile } from "@/utils/local_remote_file";
const { remote } = require("electron");
let configDir = remote.app.getPath("userData");

class HeadImageView extends Component {
	constructor(props){
		super(props);
		this.state = {};
		this.imgUrl = this.imgUrl.bind(this);
	}

	imgUrl(){
		const { imgUrl, userInfo, currentUser } = this.props;
		var fileName;
		var filePath;
		var remotePath = `${_const.domain}${imgUrl}`;
		if(!imgUrl){
			return require("@/views/config/img/default_avatar.png");
		}
		else if(imgUrl.indexOf("http") == 0){
			return imgUrl;
		}
		fileName = imgUrl.split("/").pop();
		filePath = userInfo
			? `${configDir}/easemob/easemobAvatar/${userInfo.user.easemobName}/${fileName}`
			: `${configDir}/easemob/easemobAvatar/${currentUser.user.easemobName}/${fileName}`;
		return localOrRemoteFile(filePath, remotePath);
	}

	render(){
		const url = this.imgUrl().replace(/\s/g, encodeURIComponent(" "));
		// console.log(url);
		return (
			<div className="member-img">
				<img src={ url } />
			</div>

		);
	}
}

const mapStateToProps = state => ({
	userInfo: state.userInfo
});
export default connect(mapStateToProps, actionCreators)(HeadImageView);
