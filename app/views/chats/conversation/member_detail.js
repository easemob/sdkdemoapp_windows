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
		const { selectConversationId, allMembersInfo, groupChats } = this.props;
		const selectMember = allMembersInfo[selectConversationId];
		const selectGroup = groupChats[selectConversationId];
		var groupMembers = selectGroup ? [selectGroup.owner].concat(selectGroup.adminMembers).concat(selectGroup.members) : [];
		return (

			<div className="oa-conversation-top">
				<div>
					<HeadImageView
						imgUrl={ (selectMember && selectMember.image) || (selectGroup && selectGroup.avatar) }
					/>
					<span className="ellipsis selectName">
						{
							(selectMember && (selectMember.realName || selectMember.username || selectMember.easemobName)) ||
							(selectGroup && `${selectGroup.chatName}`)
						}
					</span>
					<span>{ selectGroup && `（${groupMembers.length}）`}</span>
				</div>
				{
					selectMember && <CreateGroupView selectMember={ [selectMember] } />
				}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	allMembersInfo: state.allMembersInfo,
	selectConversationId: state.selectConversationId,
	groupChats: state.groupChats,
});
export default connect(mapStateToProps, actionCreators)(MemberDetailView);
