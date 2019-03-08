import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Modal, Icon, Button } from "antd";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import _ from "underscore";
import HeadImageView from "@/views/common/head_image";
import MenuList from "../contacts/contact_all_list";
import ContactGroupMemberView from "../contacts/contact_group_member_list";
var count = 0;

class GroupMembersView extends Component {
	constructor(props){
		super(props);
		this.handleShowAddDialog = this.handleShowAddDialog.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleCancleSelectMember = this.handleCancleSelectMember.bind(this);
		this.handleAddMember = this.handleAddMember.bind(this);
		this.handleRemoveMember = this.handleRemoveMember.bind(this);
		this.handleShowRemoveDialog = this.handleShowRemoveDialog.bind(this);
		this.handleCancelRemoveDialog = this.handleCancelRemoveDialog.bind(this);
		this.handleCancleSelectDelMember = this.handleCancleSelectDelMember.bind(this);

		this.handleSelect = this.handleSelect.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSetAdmin = this.handleSetAdmin.bind(this);
		this.handleCancelAdmin = this.handleCancelAdmin.bind(this);
		this.handleSetOwner = this.handleSetOwner.bind(this);
		this.state = {
			visible: false,
			visibleRemoveDialog: false,
			fileList: [],
			groupName: "",
			description: "",
			select: "",
		};
		const {
			editMembersGroupAction,
			globals,
			selectConversationId,
		} = this.props;

		this.easemob = globals.easemob;
		this.groupManager = globals.groupManager;
		// var me = this;
		// var timer = setTimeout(function(){
		// 	me.group = me.groupManager.fetchGroupSpecification(selectConversationId, me.error);
		// 	me.groupManager.fetchGroupMembers(selectConversationId, "", 500, me.error);
		// 	// 获取到群组成员列表 and 群管理员列表，将其添加到 reducer 中
		// 	editMembersGroupAction(
		// 		{
		// 			id: selectConversationId,
		// 			members: me.group.groupAdmins().concat(me.group.groupMembers()),
		// 			adminMembers: me.group.groupAdmins()
		// 		}
		// 	);
		// }, 2000);
		// clearTimeout(timer);


		// console.log(this.group.groupMembers());
		// console.log(this.group.groupOwner());
		// console.log(`subject:${this.group.groupSubject()}`);
		// console.log(`groupDescription:${this.group.groupDescription()}`);
		// console.log(`groupMembersCount:${this.group.groupMembersCount()}`);
		// console.log(`groupMemberType:${this.group.groupMemberType()}`);
		// console.log(`groupAdmins:${this.group.groupAdmins()}`);

	}

	// 单击实现双击效果
	handleClick(item){
		const {
			globals,
			msgsOfConversation,
			conversationOfSelect,
			allMembersInfo,
			userInfo
		} = this.props;
		var conversation;
		var messages;
		var extInfo;
		var selectMember = allMembersInfo[item.key];
		count += 1;
		setTimeout(() => {
			if(count === 2 && item.key != userInfo.user.easemobName){
				conversation = globals.chatManager.conversationWithType(selectMember.easemobName, 0);
				messages = conversation.loadMoreMessagesByMsgId("", 20,0);
				conversationOfSelect(selectMember.easemobName);
				msgsOfConversation({ id: selectMember.easemobName, msgs: messages, conversation });
			}
			count = 0;
		}, 300);
	}

	handleSelect(item){
		// 如果当前用户是群主，才有以下操作
		const {
			selectConversationId,
			userInfo,
			globals
		} = this.props;
		var owner = globals.groupManager.groupWithId(selectConversationId).groupOwner();
		if(owner == userInfo.user.easemobName){
			this.setState({ select: item.key });
		}
	}

	// 设为群主
	handleSetOwner(newOwner){
		const {
			globals,
			setOwnerAction,
			selectConversationId
		} = this.props;
		// 转让群主
		globals.groupManager.transferGroupOwner(selectConversationId, newOwner).then(res => {
			if(res.code != 0)
			  console.log("transferGroupOwner fail:" + res.description);
		});
		this.setState(this.state);
	}

	// 设置为管理员
	handleSetAdmin(member){
		// addGroupAdmin(groupId, admin, error) 提升成员为管理员
		const {
			globals,
			selectConversationId,
			setAdminAction,
		} = this.props;
		globals.groupManager.addGroupAdmin(selectConversationId, member).then(res => {
			if(res.code != 0)
			  console.log("addGroupAdmin fail:" + res.description);
		});
		this.setState(this.state);
	}

	// 取消管理员
	handleCancelAdmin(member){
		// group = groupManager.removeGroupAdmin(group.groupId(), member, error);
		const {
			globals,
			selectConversationId,
			cancelAdminAction
		} = this.props;
		globals.groupManager.removeGroupAdmin(selectConversationId, member).then(res => {
			if(res.code != 0)
			  console.log("removeGroupAdmin fail:" + res.description);
		});
		this.setState(this.state);

	}

	// 取消创建
	handleCancel(){
		const { cancelCreateGroupAction, cancelEditGroupAction } = this.props;
		this.setState({
			visible: false,
			fileList: [],
			groupName: "",
			description: "",
		});
		cancelCreateGroupAction();
		cancelEditGroupAction();
	}

	handleCancleSelectMember(item){
		const { cancelMembersAction } = this.props;
		cancelMembersAction(item);
	}

	handleShowAddDialog(){
		this.setState({
			visible: true,
		});
	}

	// 添加群组成员
	handleAddMember(){
		const {
			selectConversationId,
			globals,
			addMembers,
			cancelCreateGroupAction,
			cancelEditGroupAction,
			setNotice
		} = this.props;
		var easemob = globals.easemob;
		// 现在的群成员 + 群主 + 添加的群成员 <= 500
		var count = globals.groupManager.groupWithId(selectConversationId).groupMembersCount() + 1 + addMembers.length;
		if(count <= 500){
			cancelCreateGroupAction();
			cancelEditGroupAction();
			this.groupManager.addGroupMembers(selectConversationId, addMembers, "").then(res => {
				console.log(`selectConversationId${selectConversationId}`);
				console.log(`addMembers${addMembers}`);
				console.log(addMembers.length);
				console.log(`addGroupMembers error.errorCode = ${res.code}`);
				console.log(`addGroupMembers error.description = ${res.description}`);
			});
			

			this.setState({
				visible: false
			});
		}
		else{
			setNotice("当前选择的群成员已超过 500 人", "fail");
		}
	}

	showEditGroupMember(){
		const {
			membersIdOfEditGroup,
			selectConversationId,
			allMembersInfo,
			globals
		} = this.props;
		var group = globals.groupManager.groupWithId(selectConversationId);
		var memberInfoOfGroup;
		var groupAllMembers = [group.groupOwner()].concat(group.groupAdmins()).concat(group.groupMembers());
		// 群组所有成员
		return (
			<Modal
				title="添加群成员"
				visible={ this.state.visible }
				onCancel={ this.handleCancel }
				mask={ false }
				footer={ null }
				style={ { top: 0 } }
				width={ 700 }
			>
				<div className="oa-group">
					<div className="oa-group-setting oa-group-add-setting">
						<div>当前已选择{ groupAllMembers.concat(membersIdOfEditGroup).length }人</div>
						<div className="selected-members-container">
							{/* <div className="select-member" key={ userInfo.user.easemobName }>
								<HeadImageView imgUrl={ userInfo.user.image }></HeadImageView>
								<div className="member-name">{ userInfo.user.realName }</div>
							</div> */}
							{
								_.map(groupAllMembers.concat(membersIdOfEditGroup), (member) => {
									memberInfoOfGroup = allMembersInfo[member];
									return (
										<div className="select-member" key={ member }>
											<HeadImageView imgUrl={ memberInfoOfGroup ? memberInfoOfGroup.image : "" }></HeadImageView>
											<div className="member-name">
												{
													memberInfoOfGroup
														? memberInfoOfGroup.realName || memberInfoOfGroup.username || memberInfoOfGroup.easemobName
														: member
												}
											</div>
											{
												_.filter(groupAllMembers, item => item == member).length
													? null
													: <div className="cancel-member" onClick={ () => { this.handleCancleSelectMember(member);  } }>
														<Icon type="close" />
													</div>
											}

										</div>
									);
								})
							}
						</div>
						<Button type="primary" onClick={ this.handleAddMember }>添加</Button>
					</div>
					<div className="oa-group-member">
						<MenuList selectMemberData={ membersIdOfEditGroup } groupMemberData={ groupAllMembers } />
					</div>
				</div>
			</Modal>);
	}



	// ---------删除群成员操作-----------
	handleShowRemoveDialog(){
		this.setState({
			visibleRemoveDialog: true,
		});
	}

	handleCancleSelectDelMember(item){
		const { cancelDelMembersAction } = this.props;
		cancelDelMembersAction(item);
	}

	handleCancelRemoveDialog(){
		const { cancelRemoveGroupAction } = this.props;
		this.setState({
			visibleRemoveDialog: false,
		});
		cancelRemoveGroupAction();
	}

	handleRemoveMember(){
		const {
			selectConversationId,
			globals,
			removeMemberAction,
			removeMembers,
			cancelRemoveGroupAction
		} = this.props;
		var easemob = globals.easemob;
		// groupManager.removeGroupMembers(group.groupId(), ["jwfan3", "jwfan4"], error);
		console.log("removemembers:" + removeMembers);
		this.groupManager.removeGroupMembers(selectConversationId, removeMembers).then(res => {
			if(res.code != 0)
			  console.log(`removeGroupMembers error.description = ${res.description}`);
		});
		// console.log(`selectConversationId${selectConversationId}`);
		// console.log(`removeMembers${removeMembers}`);
		// console.log(`this.group: ${this.group}`);
		// console.log(`removeGroupMembers error.errorCode = ${error.errorCode}`);
		// console.log(`removeGroupMembers error.description = ${error.description}`);
		// this.groupManager.fetchGroupMembers();
		// console.log(this.group.groupMembers());
		cancelRemoveGroupAction();
		this.setState({
			visibleRemoveDialog: false,
		});

		// // 创建群时已开启邀请不需要确认,默认邀请成功
		// inviteMemberAction({ id: selectConversationId, members: addMembers });
	}

	showRemoveGroupMember(){
		const {
			selectConversationId,
			membersIdOfDeleteGroup,
			allMembersInfo,
			globals
		} = this.props;
		var memberInfoOfGroup;
		var memberInfo = globals.groupManager.groupWithId(selectConversationId).groupMembers();
		return (
			<Modal
				title="删除群成员"
				visible={ this.state.visibleRemoveDialog }
				onCancel={ this.handleCancelRemoveDialog }
				mask={ false }
				footer={ null }
				style={ { top: 0 } }
				width={ 700 }
			>
				<div className="oa-group">
					<div className="oa-group-setting oa-group-delete-setting">
						<div className="selected-members-container ">
							{
								_.map(membersIdOfDeleteGroup, (member) => {
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
												member == selectConversationId
													? null
													: <div className="cancel-member" onClick={ () => { this.handleCancleSelectDelMember(member);  } }>
														<Icon type="close" />
													</div>
											}

										</div>
									);
								})
							}
						</div>
						<Button type="primary" onClick={ this.handleRemoveMember }>删除</Button>
					</div>
					<div className="oa-group-member">
						<ContactGroupMemberView
							dataList={ memberInfo }
							selectMemberData={ membersIdOfDeleteGroup }
							operate="delGroupMember"
						/>
					</div>
				</div>
			</Modal>);
	}

	// 群主管理员
	showMemberInfo(member){
		const {
			selectConversationId,
			globals
		} = this.props;
		var group = globals.groupManager.groupWithId(selectConversationId);
		var owner = group.groupOwner();
		var adminMembers = group.groupAdmins();
		if(owner == member){
			return <div className="member-operate"><Icon type="team" title="群主" /></div>;
		}
		else if(adminMembers.indexOf(member) >= 0){
			if(this.state.select == member){
				return (
					<div className="member-operate">
						<span onClick={ e => this.handleCancelAdmin(member) }>
							<Icon type="user-delete" title="取消管理员" />
						</span>
						<span onClick={ e => this.handleSetOwner(member) }>
							<Icon type="team" title="设为群主" />
						</span>
					</div>
				);
			}

			return <div className="member-operate"><Icon type="user" title="管理员" /></div>;

		}
		return this.state.select == member
			? <div className="member-operate" onClick={ e => this.handleSetAdmin(member) }><Icon type="user-add" title="设为管理员" /></div>
			: <div className="member-operate"></div>;

	}

	render(){
		const {
			userInfo,
			selectConversationId,
			allMembersInfo,
			globals
		} = this.props;
		// 是否为群主
		var group = globals.groupManager.groupWithId(selectConversationId);
		var owner = group.groupOwner();
		var memberInfoOfGroup;
		var adminMembers = group.groupAdmins();
		var members = group.groupMembers();
		// var allMembers = [];

		// 把群主加到成员列表里
		// var memberInfoAndOwner = owner ? [allMembersInfo[owner]].concat(memberInfo) : memberInfo;
		// memberInfoAndOwner = _.uniq(memberInfoAndOwner);
		return (
			<div className="oa-main-list oa-conversation-list conversation-group-list">
				{
					// 创建群时开放允许普通成员邀请成员开关，则普通成员也可添加成员
					owner == userInfo.user.easemobName || adminMembers.indexOf(userInfo.user.easemobName) >= 0
						? <div className="operate-members" onClick={ this.handleShowAddDialog }>
							添加群成员
						</div>
						: null
				}
				{
					owner == userInfo.user.easemobName || adminMembers.indexOf(userInfo.user.easemobName) >= 0
						?
						<div className="operate-members" onClick={ this.handleShowRemoveDialog }>
								删除群成员
						</div>
						: null
				}
				{
					this.showEditGroupMember()
				}
				{
					this.showRemoveGroupMember()
				}
				<Menu
					style={ { border: "none" } }
					mode="inline"
					onSelect={ this.handleSelect }
					onClick={ this.handleClick }
				>
					{
						_.map([owner].concat(adminMembers).concat(members), (member) => {
							memberInfoOfGroup = allMembersInfo[member];
							return (
								<Menu.Item key={ member }>
									<div className="avatar-name">
										<HeadImageView
											imgUrl={ memberInfoOfGroup ? memberInfoOfGroup.image : "" }
										/>
										<div className="item-top">
											<span className="ellipsis item-name">
												{
													member
												}
											</span>
										</div>
									</div>
									{
										this.showMemberInfo(member)
									}
								</Menu.Item>
							);
						})
					}
				</Menu>
			</div>
		);


	}
}

const mapStateToProps = state => ({
	globals: state.globals,
	selectGroup: state.selectGroup,
	selectConversationId: state.selectConversationId,
	allMembersInfo: state.allMembersInfo,
	userInfo: state.userInfo,
	addMembers: selectors.getAddMembers(state),
	removeMembers: selectors.getRemoveMembers(state),
	membersIdOfEditGroup: selectors.membersIdArray(state),
	membersIdOfDeleteGroup: selectors.deleteGroupMembersIdArray(state),
});
export default connect(mapStateToProps, actionCreators)(GroupMembersView);
