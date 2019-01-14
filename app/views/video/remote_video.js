import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/video/action";
import HeadImageView from "@/views/common/head_image";
import _ from "underscore";

class RemoteVideoView extends PureComponent {
	constructor(props){
		super(props);
		this.handleChangeVideo = this.handleChangeVideo.bind(this);
	}

	getNameFromJid(memName){
		const { userInfo, allMembersInfo } = this.props;
		let easemobName = memName.substring(userInfo.user.appkey.length + 1);
		return allMembersInfo[easemobName];
	}

	componentDidMount(){
		const { emedia, videoStream, updateStreamAction } = this.props;
		if(this.remoteVideo){
			if(videoStream.stream.located()){
				emedia.mgr.streamBindVideo(videoStream.stream, this.remoteVideo);
			}
			else{
				emedia.mgr.subscribe(videoStream.member, videoStream.stream, true, true, this.remoteVideo);
			}
			emedia.mgr.onMediaChanaged(this.remoteVideo, (constaints) => {
			// $div.find("#aoff").html(constaints.audio ? "有声" : "无声");
			// $div.find("#voff").html(constaints.video ? "有像" : "无像");
				videoStream.stream.voff = videoStream.stream.voff ? 0 : 1;
				videoStream.stream.aoff = videoStream.stream.aoff ? 0 : 1;
				updateStreamAction({ id: videoStream.stream.owner.name, stream: videoStream });

			// // 可以通过video标签 得知发布方 是否关闭 音频 视频
			// console.warn($(videoTag).attr("easemob_stream"), "aoff", $(videoTag).attr("aoff"));
			// console.warn($(videoTag).attr("easemob_stream"), "voff", $(videoTag).attr("voff"));
			});
		}

	}

	// 点击小屏切换视频位置
	handleChangeVideo(e){
		const { currentStreamAction } = this.props;
		let easemobStream = this.remoteVideo.getAttribute("easemob_stream");
		currentStreamAction(easemobStream);
	}

	render(){
		// 渲染页面时用 emedia.mgr.getStreamById(streamId) 获取视频流的最新状态，不要根据 store 数据渲染，不准确
		const { videoStream, userInfo, isGroup, emedia, currentStreamId } = this.props;
		let memberInfo = this.getNameFromJid(videoStream.stream.owner.name);
		let showHeadImage = !!(videoStream.stream ? emedia.mgr.getStreamById(videoStream.stream.id).voff : 1);
		return (
			<div
				className={ `member-box ${currentStreamId == videoStream.stream.id ? "currentVideo" : ""}` }
				onClick={ e => this.handleChangeVideo(e) }
			>
				<div className={ `video ${showHeadImage ? "none" : ""}` }>
					<video
						ref={ (node) => { this.remoteVideo = node; } }
						autoPlay={ true }
					></video>
				</div>
				{
					showHeadImage
						? <HeadImageView imgUrl={ memberInfo.image } currentUser={ userInfo } />
						: null
				}
				<span>
					{
						isGroup
							? memberInfo.realName || memberInfo.username
							: ""
					}
				</span>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	videoStreams: state.streams,
	currentStreamId: state.currentStreamId
});
export default connect(mapStateToProps, actionCreators)(RemoteVideoView);
