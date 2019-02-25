import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import { Button } from "antd";
import HeadImageView from "../../common/head_image";
import ROUTES from "../../common/routes";

class MemberDetailView extends Component {

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleClickDeleteContact = this.handleClickDeleteContact.bind(this);
	}

	handleClick(){
		const {
			globals,
			selectMember,
			msgsOfConversation,
			conversationOfSelect,
			selectNavAction,
			setSelectConvType
		} = this.props;
		var conversation = globals.chatManager.conversationWithType(selectMember.easemobName, 0);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		var extInfo = {
			userid: selectMember.easemobName
		};
		// // 设置扩展消息
		conversation.setExtField(JSON.stringify(extInfo));
		conversationOfSelect(selectMember.easemobName);
		msgsOfConversation({ id: selectMember.easemobName, msgs: messages, conversation });
		setSelectConvType(0);
		selectNavAction(ROUTES.chats.recents.__);
	}

	handleClickDeleteContact(){
		const {
			selectMember,
			globals,
			conversationOfSelect
		} = this.props;
		var contactManager = globals.contactManager;
		var error = new globals.easemob.EMError();
		contactManager.deleteContact(selectMember.easemobName,error,true).then(() => {
			console.log("deletecontact:"+selectMember.easemobName);
			if(error.errorCode != 0){
				console.log("deletecontact fail:" + error.description);
				return;
			}
			conversationOfSelect("");
		});
	}

	render(){
		const { selectMember, userInfo } = this.props;
		console.log("selectMember:" + selectMember.easemobName);
		return (
			selectMember.easemobName
				? <div className="oa-member-detail">
					<div className="member-detail-box">
						<div className="member-detail">
							<div>
								<div className="member-title">
									<span className="font-big ellipsis member-name">{ selectMember.easemobName}</span>
								</div>
								<div>{ selectMember.easemobName }</div>
							</div>
						</div>
						{
							selectMember.easemobName != userInfo.user.easemobName
								? 
									<div>
									<Link to={ ROUTES.chats.recents.__ }>
									<br/>
									<br/>
									<Button type="primary" onClick={ this.handleClick }>发起会话</Button>
									</Link>
									<br/>
									<br/>
									<Button type="primary" onClick={ this.handleClickDeleteContact }>删除好友</Button>
									</div>
								: null
						}
						{/* {
							selectMember.easemobName
								? null
								: <span style={ { color: "red" } }>未激活</span>
						} */}
					</div>
				</div>
				: null
		);
	}
}

const mapStateToProps = state => ({
	selectMember: state.selectMember,
	userInfo: state.userInfo,
	globals: state.globals,
});
export default connect(mapStateToProps, actionCreators)(MemberDetailView);
