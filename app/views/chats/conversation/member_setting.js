import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import HeadImageView from "@/views/common/head_image";
import { Modal } from "antd";

class MemberSettingView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			messageClearVisible: false
		};
		this.handleClearRecord = this.handleClearRecord.bind(this);
		this.handleClearMessage = this.handleClearMessage.bind(this);
		this.handleCancelClearMessages = this.handleCancelClearMessages.bind(this);
	}

	handleClearRecord(){
		this.setState({
			messageClearVisible: true
		});
	}

	handleClearMessage(){
		const {
			selectConversationId,
			globals,
			clearAllMessagesAction
		} = this.props;
		var conversation = globals.chatManager.conversationWithType(selectConversationId, 0);
		conversation.clearAllMessages();
		clearAllMessagesAction({ id: selectConversationId });
		this.handleCancelClearMessages();
	}

	handleCancelClearMessages(){
		this.setState({
			messageClearVisible: false
		});
	}

	render(){
		const { selectConversationId, allMembersInfo } = this.props;
		const memberInfo = allMembersInfo[selectConversationId];
		return (
			<div>
				<div className="member-info">
					<div>
						<HeadImageView imgUrl={ memberInfo.image } />
						<div className="member-name">{ memberInfo.realName || memberInfo.username || memberInfo.easemobName }</div>
					</div>
					<div>
						<div><span>性别:</span>{ memberInfo.gender }</div>
						<div><span>邮箱:</span>{ memberInfo.email }</div>
						<div><span>电话:</span>{ memberInfo.mobilephone }</div>
					</div>
				</div>
				{/* <div>聊天置顶</div> */}
				<div className="operate-member" onClick={ this.handleClearRecord }>清空聊天记录</div>
				{/* 删除聊天记录确认框 */}
				<Modal
					title="删除聊天记录"
					visible={ this.state.messageClearVisible }
					onOk={ this.handleClearMessage }
					onCancel={ this.handleCancelClearMessages }
				>
					<div>
						确定要删除这些聊天记录吗？
					</div>
					<div>
						您的聊天记录删除后将无法找回，请确定是否要删除聊天记录
					</div>
				</Modal>
			</div>
		);

	}
}
const mapStateToProps = state => ({
	globals: state.globals,
	selectConversationId: state.selectConversationId,
	allMembersInfo: state.allMembersInfo
});
export default connect(mapStateToProps, actionCreators)(MemberSettingView);
