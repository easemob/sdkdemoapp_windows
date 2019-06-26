import React, { PureComponent } from "react";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import { connect } from "react-redux";
import { Icon, Modal, Input, Button, Form, Switch } from "antd";
import HeadImageView from "@/views/common/head_image";
import MenuList from "../contacts/contact_all_list";
import _ from "underscore";
const EventEmitter = require('events').EventEmitter;
var gEventEmiter = new EventEmitter();


class HorizontalLoginForm extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			groupName: "",
			description: "",
			createGroupButtonState: false,
			allowMemberInvited:false
		};
		this.handleChangeGroupName = this.handleChangeGroupName.bind(this);
		this.handleChangeDesc = this.handleChangeDesc.bind(this);
		this.handleChangeInvite = this.handleChangeInvite.bind(this);

		var me = this;
		gEventEmiter.on('cancelcreategroup',(event)=>{
			console.log("cancelcreategroup");
			me.cancelcreategroup();
		});
	}

	cancelcreategroup(){
		this.setState({
			groupName: "",
			description: "",
			createGroupButtonState: false,
			allowMemberInvited:false
		})
	}
	handleChangeGroupName(e){
		this.setState({
			groupName: e.target.value
		});
	}

	handleChangeDesc(e){
		this.setState({
			description: e.target.value
		});
	}

	// 允许群成员邀请成员开关
	handleChangeInvite(checked){
		this.setState({
			allowMemberInvited: checked
		})
	}

	render(){
		const { getFieldDecorator,setFieldsValue } = this.props.form;
		const { membersIdOfCreateGroup } = this.props.reduxProps;
		const { createGroup } = this.props;
		return (
			<Form
				onSubmit={
					(e) => {
						e.preventDefault();
						createGroup(this.state.groupName, this.state.description,this.state.allowMemberInvited);
						setFieldsValue({
							groupName: "",
							groupDescription: ""
						});
						this.setState({
							"groupName":"",
							"description":"",
							allowMemberInvited:false
						})
					}
				}
				className="login-form"
			>
				<FormItem>
					{/* <span>群名称</span> */}
					{getFieldDecorator("groupName", {
						rules: [{ max: 20, message: "群名称最多为 20 个字" } ],
					})(
						<Input
							// prefix={ <Icon type="user"style={ { color: "rgba(0,0,0,.25)" } } /> }
							placeholder="群名称"
							onChange={ this.handleChangeGroupName }
						/>
					)}
				</FormItem>
				<FormItem>
					{/* <span>群描述</span> */}
					{getFieldDecorator("groupDescription",{})(
					<Input
						// prefix={ <Icon type="lock" style={ { color: "rgba(0,0,0,.25)" } } /> }
						placeholder="群描述"
						onChange={ this.handleChangeDesc }
					/>
					)}
				</FormItem>

				<FormItem>
					<span>允许群成员邀请</span>
					<Switch
					    id="allowMemberInvited"
						checkedChildren="开"
						unCheckedChildren="关"
						checked={ this.state.allowMemberInvited }
						onChange={ this.handleChangeInvite }
					/>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						disabled={ !(membersIdOfCreateGroup.length > 0) }
					>
						确定
					</Button>
				</FormItem>
			</Form>
		);
	}
}
const FormItem = Form.Item;
const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);
class CreateGroupView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			visible: false,
			groupName: "",
			description: "",
			previewVisible: false,
			previewImage: "",
			fileList: [],
			avatarUrl: ""
		};
		this.handleCreatGroup = this.handleCreatGroup.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.createGroup = this.createGroup.bind(this);
		this.handlePreviewAvatar = this.handlePreviewAvatar.bind(this);
		this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
		this.handleCancelAvatar = this.handleCancelAvatar.bind(this);
		this.handleCancleSelectMember = this.handleCancleSelectMember.bind(this);
		this.handleRemoveAvatar = this.handleRemoveAvatar.bind(this);
	}

	handleCancelAvatar(){
		this.setState({ previewVisible: false });
	}

	handleRemoveAvatar(){
		this.setState({ avatarUrl: "", fileList: [] });
	}

	handlePreviewAvatar(file){
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	handleChangeAvatar({ fileList, file }){
		const { setNotice, selectConversationId } = this.props;
		this.setState({ fileList });
		if(file.status == "done"){
			this.setState({ avatarUrl: file.response.url });
		}
		else if(file.status == "error"){
			if(file.error.status == 413){
				setNotice("上传失败，上传头像过大", "fail");
				this.setState({ fileList: [
					{
						uid: -1,
						name: "",
						status: "done",
						url: `${require("@/views/config/img/default_avatar.png")}`,
					}
				] });
			}
		}
	}

	handleCreatGroup(){
		const {
			selectMembersAction,
			selectMember
		} = this.props;
		this.setState({
			visible: true,
			fileList: [],
			avatarUrl: ""
		});
		//
		selectMember && selectMembersAction(selectMember);

	}

	// 取消创建
	handleCancel(){
		const { cancelCreateGroupAction } = this.props;
		this.setState({
			visible: false,
			fileList: [],
			avatarUrl: ""
		});
		cancelCreateGroupAction();
		console.log("cancel");
		gEventEmiter.emit('cancelcreategroup');
	}

	// 创建群组时除了自己应该至少选 2 人，否则去单聊
	createGroup(groupName, description,allowMemberInvited){
		const {
			membersId,
			membersIdArray,
			userInfo,
			membersName,
			globals,
			conversationOfSelect,
			msgsOfConversation,
			allMembersInfo,
			cancelCreateGroupAction,
			setNotice,
			createAGroup,
			setSelectConvType
		} = this.props;
		var conversation;
		var messages;
		var extInfo;
		var selectMember;
		var username;
		if(membersIdArray.length == 1){
			setNotice("当前选择的群成员为2人，自动进入单聊", "success");
			selectMember = allMembersInfo[membersIdArray[0]];
			conversation = globals.chatManager.conversationWithType(membersIdArray[0], 0);
			messages = conversation.loadMoreMessagesByMsgId("", 20,0);
			conversationOfSelect(membersIdArray[0]);
			msgsOfConversation({ id: membersIdArray[0], msgs: messages, conversation });
			cancelCreateGroupAction();
			this.setState({
				visible: false,
			});
			setSelectConvType(0);
			return;
		}
		else if(membersIdArray.length >= 500){
			setNotice("当前选择的群成员已超过 500 人", "fail");
		}
		else{
			username = userInfo.user.realName || userInfo.user.username || userInfo.user.easemobName;
			groupName = groupName ? groupName.substring(0, 20) : `${username},${membersName}`.substring(0, 20);
			description = description ? description.substring(0, 100) : "";
			var groupManager = globals.groupManager;
			// 组设置，4个参数分别为组类型（0,1,2,3），最大成员数，邀请是否需要确认，扩展信息
			var setting = new globals.easemob.EMMucSetting(allowMemberInvited?1:0, 5000, false, "test");
			console.log("membersIdArray:" + membersIdArray);
			console.log("membersId:" + membersId);
			groupManager.createGroup(groupName,description,"welcome message",setting,membersIdArray).then((res)=>{
				console.log(res, 2);
				if(res.code == 0)
				{
					let group = res.data;
					let conversation = globals.chatManager.conversationWithType(group.groupId(),1);
					//createGroup({"easemobGroupId":group.groupId(),"convesation":conversation});
					createAGroup({easemobGroupId:group.groupId(),conversation});
					setSelectConvType(1);
					console.log("createGroup success:" + group.groupId());
				}else
					console.log("createGroup fail!errorDescription:" + res.description);
				cancelCreateGroupAction();
			});
			console.log(3);
			/*,(group,err) => {
				if(err.errorCode == 0)
				{
					let conversation = globals.chatManager.conversationWithType(group.groupId(),1);
					//createGroup({"easemobGroupId":group.groupId(),"convesation":conversation});
					createAGroup({easemobGroupId:group.groupId(),conversation});
					setSelectConvType(1);
					console.log("createGroup success:" + group.groupId());
				}else
					console.log("createGroup fail!errorDescription:" + err.description);
				cancelCreateGroupAction();
				
			});*/
			cancelCreateGroupAction();
			this.setState({
					visible: false,
				});
		}


	}

	handleCancleSelectMember(item){
		const { cancelMembersAction } = this.props;
		cancelMembersAction(item);
	}

	render(){
		const {
			userInfo,
			selectConversationId,
			selectMember,
			membersIdOfCreateGroup,
			allMembersInfo
		} = this.props;
		const { previewVisible, previewImage, fileList } = this.state;
		var groupMemberInfoData = userInfo ? (selectMember ? [userInfo.user].concat(selectMember) : [userInfo.user]) : [];
		var groupMemberIds = _.pluck(groupMemberInfoData, "easemobName");
		var memberInfoOfGroup;
		return (
			<div>
				<div className="add-members" onClick={ this.handleCreatGroup }>
					<Icon type="plus-square-o" />
				</div>
				{userInfo ? 
					<Modal
						title="新建群"
						visible={ this.state.visible }
						onCancel={ this.handleCancel }
						mask={ false }
						footer={ null }
						style={ { top: 0 } }
						width={ 700 }
					>
						<div className="oa-group">
							<div className="oa-group-setting oa-group-create-setting">
								<div>当前已选择{ membersIdOfCreateGroup.length + 1}人</div>
								<div className="selected-members-container">
									<div className="select-member" >
										<HeadImageView imgUrl={ "" }></HeadImageView>
										<div className="member-name">{ userInfo && userInfo.user.easemobName }</div>
									</div>
									{
										_.map(membersIdOfCreateGroup, (member) => {
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
														member == selectConversationId
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
								<WrappedHorizontalLoginForm reduxProps={ this.props } createGroup={ this.createGroup } />
							</div>
							<div className="oa-group-member">
								<MenuList
									selectMemberData={ membersIdOfCreateGroup }
									groupMemberData={ groupMemberIds }
								/>
							</div>
						</div>
					</Modal> : null
				}
			</div>
		);

	}
}

const mapStateToProps = state => ({
	globals: state.globals,
	allMembersInfo: state.allMembersInfo,
	selectConversationId: state.selectConversationId,
	membersId: selectors.membersIdOfGroup(state),
	membersName: selectors.membersNameOfGroup(state),
	userInfo: state.userInfo,
	// membersOfCreateGroup: state.membersOfCreateGroup,
	membersIdArray: selectors.membersIdArray(state),
	membersIdOfCreateGroup: selectors.createGroupMembersIdArray(state),
});
export default connect(mapStateToProps, actionCreators)(CreateGroupView);
