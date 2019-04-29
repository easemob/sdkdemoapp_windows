import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer, clipboard } from "electron";
import * as actionCreators from "@/stores/actions";
import { withRouter } from "react-router-dom";
import { msgParse } from "@/utils/msg_parse";
import ImgPreview from "./img_preview";
import HeadImageView from "@/views/common/head_image";
import FileView from "./file_view";
import LocationView from "./location_view";
import moment from "moment";
import { downLoadFile } from "@/utils/local_remote_file";
var loadMoreMessage = false;
var scrollHeight = 0;
class ConversationDetailView extends Component {

	constructor(props){
		super(props);
		const { globals, setNotice } = this.props;
		var me = this;
		// this.recallMsg = {};
		this.handleClick = this.handleClick.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleClickUrl = this.handleClickUrl.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);

		ipcRenderer.removeAllListeners("recallMessage");
		ipcRenderer.removeAllListeners("deleteMessage");
		ipcRenderer.removeAllListeners("savedFile");

		ipcRenderer.on("recallMessage", () => {
			if(!!(moment().format("x") - this.recallMsg.timestamp() < 60 * 2 * 1000)){
				me.onRecallMessages(me.recallMsg);
				globals.chatManager.recallMessage(me.recallMsg);
			}
			else{
				setNotice("撤回失败，时间已超过 2 分钟", "fail");
			}

			// ipcRenderer.removeAllListeners("recallMessage");
			// me.recallMsg = {};
		});

		ipcRenderer.on("deleteMessage", () => {
			me.onDeleteMessages(me.recallMsg);
			// me.recallMsg = {};
		});

		ipcRenderer.on("savedFile", (event, { filePath, remotePath }) => {
			downLoadFile(filePath, remotePath);
			// ipcRenderer.removeAllListeners("savedFile");
		});

		ipcRenderer.on("copiedValue", () => {
			var clipboardText  = "";
			console.log(window.getSelection());
			if(window.getSelection().toString()){
				clipboardText = window.getSelection().toString();
				console.log(window.getSelection().toString());
			}
			else{
				clipboardText = window.getSelection().focusNode.parentElement.innerText;
				console.log(window.getSelection().focusNode.parentElement.innerHTML);
			}
			clipboard.writeText(clipboardText);
		});
	}

	// 删除消息
	onDeleteMessages(message){
		const { deleteMessageAction, messages, isSelectCovGroup, globals } = this.props;
		const conversationId = message.conversationId();
		var msgs = messages[conversationId];
		var conversationType = isSelectCovGroup;
		console.log("type:"+conversationType);
		var conversation = globals.chatManager.conversationWithType(conversationId, conversationType);
		conversation.removeMessage(message);
		deleteMessageAction({
			messages: msgs,
			id: conversationId,
			deleteMsg: message,
		});
	}

	// 消息撤回
	onRecallMessages(message){
		const { recallMessageAction, messages, isSelectCovGroup, globals, userInfo, selectConversationId,unReadMsgCountAction } = this.props;
		const conversationId = selectConversationId;
		var msgs = messages[conversationId];
		var conversationType = isSelectCovGroup;
		var conversation = globals.chatManager.conversationWithType(conversationId, conversationType);
		var messageText = "您撤回了一条消息";
		var textMsgBody = new globals.easemob.EMTextMessageBody(messageText);
		var textRecvMsg = globals.easemob.createReceiveMessage(conversationId, userInfo.user.easemobName, textMsgBody);
		textRecvMsg.setFrom("system");
		recallMessageAction({
			messages: msgs,
			id: conversationId,
			recallMsg: message,
			insertMsg: textRecvMsg,
			conversation
		});
		conversation.markMessageAsRead(textRecvMsg.msgId(),true);
		unReadMsgCountAction({ id: conversationId, unReadMsg: [] });
	}

	// 加载更多历史消息
	handleClick(){
		var conversation;
		var moreMsgs;
		const { globals, selectConversationId, messages, msgsOfHistory } = this.props;
		conversation = globals.chatManager.conversationWithType(selectConversationId, 0);
		moreMsgs = conversation.loadMoreMessagesByTime( messages[selectConversationId][0].timestamp(), 20,0);
		msgsOfHistory({ id: selectConversationId, msgs: moreMsgs, conversation });
		scrollHeight = this.refs.clientNode.scrollHeight;
		loadMoreMessage = true;
	}

	handleClickUrl(e){
		var url = e.target.id;
		if(url && url.indexOf("http") != 0){
			url = `http://${url}`;
		}
		url && ipcRenderer.send("open-url", url);
	}

	handleContextMenu(e, msg){
		e.preventDefault();
		const { userInfo } = this.props;
		var parseMsg = msgParse(msg, userInfo);
		var fromMe = msg.from() == userInfo.user.easemobName;
		var isAllowRecall = !!(moment().format("x") - msg.timestamp() < 60 * 2 * 1000);
		var type = parseMsg.type;
		this.recallMsg = msg;
		ipcRenderer.removeAllListeners("show-context-menu");

		ipcRenderer.send("show-context-menu", fromMe, isAllowRecall, type, parseMsg.localPath, parseMsg.displayName, parseMsg.remotePath);
	}

	getSide(msgId){
		const { userInfo } = this.props;
		return userInfo.user.easemobName == msgId ? "right" : "left";
	}

	renderMsg(msg, item){
		switch(msg.type){
		case "TEXT":
			return <div dangerouslySetInnerHTML={ { __html: msg.value } }></div>;
		case "IMAGE":
			return (
				<ImgPreview
					thumbUrl={ msg.thumbUrl } url={ msg.localPath } remotePath={ msg.remotePath }
				/>);
		case "FILE":
			return <FileView msg={ msg } item={ item } { ...this.props } />;
		case "VIDEO":
			return <div>[收到一段视频，请在手机上查看]</div>;
		case "AUDIO":
			return <div>[收到一段语音，请在手机上查看]</div>;
			// return <AudioView { ...msg } />;
		case "LOCATION":
			return <div>[收到位置消息，请在手机上查看]</div>;
		default:
			return msg.value;
		}
	}

	handleScroll(){
		// console.log(this.contentNode.clientHeight);
		// console.log(this.contentNode.height);
		// console.log(this);
		var me = this;
		setTimeout(function(){
			if(me.refs.clientNode){

				me.refs.clientNode.scrollTop = me.refs.clientNode.scrollHeight - me.refs.clientNode.clientHeight;
				if(loadMoreMessage && scrollHeight)
				{
					me.refs.clientNode.scrollTop = me.refs.clientNode.scrollHeight - scrollHeight;
					loadMoreMessage = false;
					scrollHeight = 0;
				}
			}
		}, 0);

	}

	showMemberInfo(item){
		const { selectConversationId, userInfo,isSelectCovGroup } = this.props;
		if(isSelectCovGroup && item.from() != userInfo.user.easemobName){
			return item.from();
		}
		return "";
	}

	render(){
		const {
			selectConversationId,
			messages,
			conversations,
			allMembersInfo,
			userInfo,
		} = this.props;
		// conversation = chatManager.conversationWithType(selectConversationId, 0);
		// firstLatestMessage = conversation.latestMessage();
		// 第二个参数省略是最后一条消息的 ID
		// messages = conversation.loadMoreMessages(0, "", 20);

		// 更多历史消息
		// conversation.loadMoreMessages(1, 最早消息的时间戳, 20);

		// 消息转换
		const historyMsg = messages[selectConversationId] || [];
		var msg;
		return (
			<div className="oa-conversation-container" ref="clientNode" >
				{
					// 当前加载的消息数 < 会话的总消息数
					conversations[selectConversationId] &&
					historyMsg.length < conversations[selectConversationId].messagesCount() &&
					conversations[selectConversationId].messagesCount() > 20
						? <div className="detail-getmore" onClick={ this.handleClick }>更多历史消息</div>
						: null
				}
				{
					historyMsg.map((item, idx) => {
						msg = msgParse(item, userInfo);
						return (
							item.from() == "system"
								? <div key={ `${item.msgId() + idx}` } className="notice-msg">{ msg.value }</div>
								: <div key={ `${item.msgId() + idx}` } className={ `${this.getSide(item.from())} detail-message-box` } >
									<div className="message-time">
										{
											this.showMemberInfo(item)
										}
										{ moment(item.timestamp()).format("YY/MM/DD HH:mm")}
									</div>
									<div className={ `${this.getSide(item.from())} detail-message` }>
										<div className="detail-avatar">
											<HeadImageView imgUrl= "" />
										</div>
										<div className="message-from">
											{/* <span>{ item.from() }</span> */}
										</div>
										<div className="message-info" onClick={ this.handleClickUrl } onContextMenu={ e => this.handleContextMenu(e, item) } >
											{ this.renderMsg(msg, item) }
										</div>
									</div>

								</div>
						);
					})
				}
				{
					this.handleScroll()
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectConversationId: state.selectConversationId,
	messages: state.messages,
	conversations: state.conversations,
	allMembersInfo: state.allMembersInfo,
	userInfo: state.userInfo,
	globals: state.globals,
	groupAtMsgs: state.groupAtMsgs,
	isSelectCovGroup: state.isSelectCovGroup
});
export default withRouter(connect(mapStateToProps, actionCreators)(ConversationDetailView));
