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
			selectNavAction,
			setSelectConvType
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
		var group = globals.groupManager.groupWithId(selectGroup.easemobGroupId);
		globals.groupManager.fetchGroupMembers(selectGroup.easemobGroupId, "", 500, error);
		groupInfo = {
			owner: group.groupOwner(),
			members: group.groupMembers(),
			adminMembers: group.groupAdmins()
		};

		conversationOfSelect(selectGroup.easemobGroupId);
		msgsOfConversation({ id: selectGroup.easemobGroupId, msgs: messages, conversation });

		selectNavAction(ROUTES.chats.recents.__);
		setSelectConvType(1);
	}

	render(){
		const { selectGroup,globals } = this.props;
		console.log("selectGroup:" + selectGroup.easemobGroupId);
		var group = globals.groupManager.groupWithId(selectGroup.easemobGroupId);
		return (
			selectGroup.easemobGroupId
				? <div className="oa-group-detail">
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
					<div className="group-name">{ group.groupSubject() }</div>
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
