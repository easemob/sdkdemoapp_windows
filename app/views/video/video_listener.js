import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import { Icon } from "antd";
import { ipcRenderer } from "electron";

// ##  视频消息
// {
//     "em_apns_ext": {
//         "push_type": 0				// 推送类型，用于苹果推送，值为0，1，2，分别表示0，普通消息(目前可以不传，或者每条消息都传0)；1，语音消息；2，视频消息；
//     },
//     "conference": {
//         "conf_type": 0,             // 呼叫类型，int型，值为0，1，2，分别表示  单聊语音，单聊视频，群视频
//         "confId": "conferenceId",   // 创建会议后返回的id
//         "inviter": "inviterName",   // 邀请人信息，用于被呼叫方显示呼叫方信息
//         "password": "password",     // 创建会议时提供的password，加入时也需要，所以一并传过去。
//         "conversationId": "conversationId" // 语音所属ConversationID，如果是群，值是群id，如果是单人，值是发起方
//     }
// }

class VideoListenerView extends PureComponent {
	constructor(props){
		super(props);
		const { remoteVideo, emedia } = this.props;
		console.log(this.props);
		console.log("this.props");
		
	}

	render(){
		return null;
	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(VideoListenerView);
