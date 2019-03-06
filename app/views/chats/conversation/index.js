import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import MenuList from "./conversation_list";
import ConversationDetailView from "./conversation_detail";
import ChatSendBoxView from "../editor/chat_sendbox";
import MemberDetailView from "./member_detail";
import GroupTabView from "../groups/group_tab";
import MemberTabView from "../members/index";
import moment from "moment";


class ConversationView extends PureComponent {

	showInfo(){
		const { isSelectCovGroup } = this.props;
		// 群组
		if(isSelectCovGroup){
			return <GroupTabView />;
		}
		// 个人
		return <MemberTabView />;
	}


	render(){
		const { selectConversationId } = this.props;
		return (
			<div>
				<MenuList { ...this.props } />
				{
					selectConversationId
						? <div className="oa-conversation-box">
							<div className="chat-container">
								<MemberDetailView />
								<div className="chat-detail">
									<ConversationDetailView { ...this.props } />
									<ChatSendBoxView { ...this.props } key={ selectConversationId } />
								</div>
							</div>
							{ this.showInfo() }
						</div>
						: null
				}

			</div>);

	}
}
const mapStateToProps = state => ({
	selectConversationId: state.selectConversationId,
	isSelectCovGroup:state.isSelectCovGroup
});
export default withRouter(connect(mapStateToProps, actionCreators)(ConversationView));
