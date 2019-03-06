import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import { connect } from "react-redux";
import HeadImageView from "@/views/common/head_image";
import CreateGroupView from "../groups/group_create";

class MemberDetailView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		const { selectConversationId, allMembersInfo,isSelectCovGroup,globals } = this.props;
		const selectMember = allMembersInfo[selectConversationId];
		const selectGroup = isSelectCovGroup;
		//var groupMembers = selectGroup ? [selectGroup.owner].concat(selectGroup.adminMembers).concat(selectGroup.members) : [];
		let isGroup = isSelectCovGroup == 1;
		let conversation = globals.chatManager.conversationWithType(selectConversationId, isGroup);
		let name;
		console.log("isGroup:" + isGroup + "    isSelectCovGroup:" + isSelectCovGroup);
		console.log("selectConversationId:" + selectConversationId);
		var lenth;
		if(isGroup)
		{
			var group = globals.groupManager.groupWithId(selectConversationId);
			name = group.groupSubject();
			lenth = group.groupMembersCount();
			console.log("-----------------" + lenth);
		}else
			name = selectConversationId;
		console.log("name:" + name);
		return (

			<div className="oa-conversation-top">
				<div>
					<HeadImageView
						imgUrl={ "" }
					/>
					<span className="ellipsis selectName">
						{
							name
						}
					</span>
					<span>{ isGroup && `（${lenth}）`}</span>
				</div>
				{
					!isGroup && <CreateGroupView selectMember={ [{easemobName:selectConversationId}] } />
				}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	allMembersInfo: state.allMembersInfo,
	selectConversationId: state.selectConversationId,
	isSelectCovGroup:state.isSelectCovGroup,
	globals: state.globals,
});
export default connect(mapStateToProps, actionCreators)(MemberDetailView);
