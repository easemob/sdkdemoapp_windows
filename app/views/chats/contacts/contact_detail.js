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
	}

	handleClick(){
		const {
			globals,
			selectMember,
			msgsOfConversation,
			conversationOfSelect,
			selectNavAction
		} = this.props;
		var conversation = globals.chatManager.conversationWithType(selectMember.easemobName, 0);
		var messages = conversation.loadMoreMessagesByMsgId("", 20,0);
		var extInfo = {
			avatar: selectMember.image,
			nick: selectMember.realName,
			userid: selectMember.id
		};
		// // 设置扩展消息
		conversation.setExtField(JSON.stringify(extInfo));
		conversationOfSelect(selectMember.easemobName);
		msgsOfConversation({ id: selectMember.easemobName, msgs: messages, conversation });

		selectNavAction(ROUTES.chats.recents.__);
	}

	render(){
		const { selectMember, userInfo } = this.props;
		return (
			selectMember.id
				? <div className="oa-member-detail">
					<div className="member-detail-box">
						<div className="member-detail">
							<div>
								<div className="member-title">
									<span className="font-big ellipsis member-name">{ selectMember.realName || selectMember.username || selectMember.easemobName}</span>
									<span>{ selectMember.gender }</span>
								</div>
								<div>{ selectMember.username }</div>
							</div>
							<HeadImageView imgUrl={ selectMember.image }></HeadImageView>
						</div>
						<div className="member-detail-list">
							<p><span className="detail-label">手机</span><span className="detail-info">{ selectMember.mobilephone }</span></p>
							<p><span className="detail-label">邮箱</span><span className="detail-info">{ selectMember.email }</span></p>
						</div>
						{
							selectMember.id != userInfo.user.id && selectMember.easemobName
								? <Link to={ ROUTES.chats.recents.__ }>
									<Button type="primary" onClick={ this.handleClick }>发起会话</Button>
								</Link>
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
