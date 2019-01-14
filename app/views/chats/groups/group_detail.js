import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import { Button } from "antd";
import HeadImageView from "../../common/head_image";
import ROUTES from "../../common/routes";

class GroupDetailView extends Component {

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		const {
			globals,
			selectGroup,
			msgsOfConversation,
			conversationOfSelect,
			changeGroupInfoAction,
			selectNavAction
		} = this.props;
		var groupInfo;
		var conversation = globals.chatManager.conversationWithType(selectGroup.easemobGroupId, 1);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		// var extInfo = {
		// 	avatar: selectMember.image,
		// 	nick: selectMember.realName,
		// 	userid: selectMember.id
		// };
		// // // 设置扩展消息
		// conversation.setExtField(JSON.stringify(extInfo));

		// 从 sdk 获取群主及群成员列表更新 reducer
		var error =  new globals.easemob.EMError();
		var group = globals.groupManager.fetchGroupSpecification(selectGroup.easemobGroupId, error);
		globals.groupManager.fetchGroupMembers(selectGroup.easemobGroupId, "", 500, error);
		groupInfo = {
			owner: group.groupOwner(),
			members: group.groupMembers(),
			adminMembers: group.groupAdmins()
		};
		changeGroupInfoAction({ id: [selectGroup.easemobGroupId], groupInfo });

		conversationOfSelect(selectGroup.easemobGroupId);
		msgsOfConversation({ id: selectGroup.easemobGroupId, msgs: messages, conversation });

		selectNavAction(ROUTES.chats.recents.__);
	}

	render(){
		const { selectGroup } = this.props;
		return (
			selectGroup.easemobGroupId
				? <div className="oa-group-detail">
					<HeadImageView imgUrl={ selectGroup.avatar } />
					{/* {
						selectGroup.members && _.map(selectGroup.members, (member) => {
							return (
								<div className="group-members">
									<HeadImageView imgUrl={ allMembersInfo[member].image } />
									<div>{ allMembersInfo[member].realName }</div>
								</div>
							);

						})
					} */}
					<div className="group-name">{ selectGroup.chatName }</div>
					<Link to={ ROUTES.chats.recents.__ }>
						<Button type="primary" onClick={ this.handleClick }>进入群聊</Button>
					</Link>
				</div>
				: null
		);
	}
}

const mapStateToProps = state => ({
	selectGroup: state.selectGroup,
	userInfo: state.userInfo,
	allMembersInfo: state.allMembersInfo,
	globals: state.globals
});
export default connect(mapStateToProps, actionCreators)(GroupDetailView);
