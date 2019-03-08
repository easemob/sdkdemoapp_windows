import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal } from "antd";
import * as actionCreators from "@/stores/actions";
import _ from "underscore";
import ContactGroupMemberView from "../contacts/contact_group_member_list";
import HeadImageView from "@/views/common/head_image";
import { audioAndVideo } from "@/views/main/receive_audio_video";

// const NavLink = ({ item }) => (
// 	<Menu.Item key={ item.id }> {item.orgName || item.realName} </Menu.Item>
// );

class GroupVideoInvite extends Component {
	constructor(props){
		super(props);
		this.state = {
			visibleInviteDialog: true,
		};
		this.handleCancelInviteDialog = this.handleCancelInviteDialog.bind(this);
		this.handleInviteMember = this.handleInviteMember.bind(this);
		this.handleCancleSelectDelMember = this.handleCancleSelectDelMember.bind(this);
	}

	handleCancleSelectDelMember(item){
		// console.log(member);
		const { cancelVideoMembersAction } = this.props;
		cancelVideoMembersAction(item);
	}

	handleCancelInviteDialog(){
		const { hideInviteDialog } = this.props;
		this.setState({ visibleInviteDialog: false });
		hideInviteDialog();
	}

	handleAudioAndVideo(){
		const { userInfo, globals, conId, allMembersInfo, isSelectCovGroup } = this.props;
		var logintoken = globals.emclient.getLoginInfo().loginToken;
		let isGroup = isSelectCovGroup;
		audioAndVideo({
			userInfo: JSON.stringify(userInfo),
			conversationId: conId,
			inviterInfo: JSON.stringify(allMembersInfo[conId]),
			logintoken,
			isVideo: false,	// 默认不开启摄像头
			isInvited: false,
			isGroup,
			groupInfo:isSelectCovGroup,
			allMembersInfo: JSON.stringify(allMembersInfo),
		});
	}

	handleInviteMember(){
		this.handleAudioAndVideo();
		this.handleCancelInviteDialog();
	}

	getMemberInfo(){
		let members;
		let adminMembers;
		const { conId,globals, } = this.props;
		let group = globals.groupManager.groupWithId(conId,1);
		if(!group)
		    return [];
		
		let groupOwner = group.groupOwner();
		members = group.groupMembers();
		adminMembers = group.groupAdmins();
		return [groupOwner].concat(adminMembers).concat(members);
	}

	render(){
		const {
			conId,
			allMembersInfo,
			selectMemberData,
			membersOfVideoGroup
		} = this.props;
		var memberInfoOfGroup;
		let dataList = this.getMemberInfo();
		return (
			<Modal
				title="邀请群成员"
				visible={ this.state.visibleInviteDialog }
				onCancel={ this.handleCancelInviteDialog }
				mask={ false }
				footer={ null }
				style={ { top: 0 } }
				width={ 700 }
			>
				<div className="oa-group">
					<div className="oa-group-setting oa-group-delete-setting">
						<div className="selected-members-container ">
							{
								_.map(selectMemberData, (member) => {
									memberInfoOfGroup = allMembersInfo[member];
									return (
										<div className="select-member" key={ member }>
											<HeadImageView imgUrl={ memberInfoOfGroup ? memberInfoOfGroup.image : "" }></HeadImageView>
											<div className="member-name">
												{ memberInfoOfGroup
													? memberInfoOfGroup.realName || memberInfoOfGroup.easemobName
													: member
												}
											</div>
											{
												member == conId
													? null
													: <div className="cancel-member" onClick={ () => { this.handleCancleSelectDelMember(memberInfoOfGroup);  } }>
														<Icon type="close" />
													</div>
											}

										</div>
									);
								})
							}
						</div>
						<Button type="primary" onClick={ this.handleInviteMember } disabled={ !(membersOfVideoGroup.length > 0) }>确定</Button>
					</div>
					<div className="oa-group-member">
						<ContactGroupMemberView
							dataList={ dataList }
							selectMemberData={ selectMemberData }
							operate="videoCall"
						/>
					</div>
				</div>
			</Modal>);
	}
}

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	globals: state.globals,
	allMembersInfo: state.allMembersInfo,
	membersOfVideoGroup: state.membersOfVideoGroup,
	isSelectCovGroup: state.isSelectCovGroup,
	globals: state.globals
});
export default connect(mapStateToProps, actionCreators)(GroupVideoInvite);
