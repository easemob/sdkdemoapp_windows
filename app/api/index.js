import $ from "jquery";
import _ from "underscore";
// import clientStorage from "@/common/client_storage";
var _const = require("@/views/common/domain");
export const ajaxRequest = (url, params) =>
	$.ajax({
		url,
		type: "GET",
		contentType: "application/json",
		...params
	});

const sendCmdMessage = (data, easemob, groupId, user, globals) => {
	var params = [];
	var cmdMsgBody = new easemob.EMCmdMessageBody("oa_groups_changed");
	var cmdMessage = easemob.createSendMessage(user, groupId, cmdMsgBody);
	_.map(data, (value, key) => {
		value && params.push({ key, value });
	});
	cmdMessage.setJsonAttribute(
		"groups", `[${JSON.stringify(data)}]`
	);
	cmdMessage.setChatType(1);
	globals.chatManager.sendMessage(cmdMessage);
};

export default {
	// 登录
	login(username, password, deviceType){
		return ajaxRequest(
			`${_const.domain}/v1/users/login`,
			{
				type: "POST",
				data: JSON.stringify({ username, password, deviceType })
			}
		)
		.then(
			(data) => {
				data.entity.status = data.status;
				return data.entity;
			},
			data => data
		);
	},
	// 获取根部门
	getRootOrg(tenantId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/organizations/-1`
		)
		.then((data) => {
			return data.entities;
		});
	},
	// 获取子部门
	getChildOrg(tenantId, orgId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/organizations/${orgId}`
		)
		.then((data) => {
			return { [orgId]: data.entities };
		});
	},
	// 获取部门下的成员
	getMembersOfOrg(tenantId, orgId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users?organizationId=${orgId}&page=0&size=500`
		)
		.then((data) => {
			return { [orgId]: data.entities };
		});
	},

	getAllMembers(tenantId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users?size=500`
		)
		.then(data => data.entities);
	},

	// 创建群聊
	createGroup(tenantId, chatName, avatar, members, description, easemobName, userId, chatManager, allowinvites){
		var data = {
			chatName, // 群聊名称 ， 必填
			members,  // 群成员,  必填； 填写其他成员的easemobName, 不包含自己
			maxusers: 500,   // 最大群聊人数， 必填; 不能超过2000
			description,  // 群聊描述， 必填；
			isPublic: false,  // 是否为公开群; 必填
			newmemberCanreadHistory: false,  // 新成员可查看聊天历史消息； 必填
			allowinvites,  // 是否允许邀请入群， 必填
			avatar,  // 群头像， 必填
			membersOnly: true,  // 是否需要管理员审批   必填；
			owner: easemobName,   // 创建人，自己的easemobname
			userId,   // 创建人在AppSever的userid
		};
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/groupchats`,
			{
				type: "POST",
				data: JSON.stringify(data)
			}
		)
		.then((data) => {
			data = data.entity;
			data.members = data.members ? data.members.split(",") : [];
			data.adminMembers = [];
			data.conversation = chatManager.conversationWithType(data.easemobGroupId, 1);
			return data;

		}
		);
	},

	// 获取自己已加入的群聊
	getGroupChats(tenantId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/groupchats`
		)
		.then((data) => {
			_.map(data.entities, (item) => {
				// item.members = item.members.split(",");
				item.members = [];
				item.adminMembers = [];
			});
			return data.entities;
		});
	},

	// 是群主，解散群 /v1/tenants/{tenantid}/groupchats/{easemobGroupId}
	destoryGroup(tenantId, easemobGroupId){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/groupchats/${easemobGroupId}`,
			{
				type: "DELETE"
			}
		)
		.then((data) => { console.log(data); return easemobGroupId;});
	},

	// 群主修改群聊信息 // /v1/tenants/{tenantid}/groupchats/{easemobGroupId}
	changeGroupInfo(tenantId, easemobGroupId, data, easemob, user, globals){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/groupchats/${easemobGroupId}`,
			{
				type: "PUT",
				data: JSON.stringify(data)
			}
		)
		.then((data) => {
			var sendData = {
				id: data.entity.easemobGroupId,
				name: data.entity.chatName,
				avatar: data.entity.avatar
			};
			sendCmdMessage(sendData, easemob, easemobGroupId, user, globals);
			return {
				id: data.entity.easemobGroupId,
				chatName: data.entity.chatName,
				avatar: data.entity.avatar
			};
		});
	},

	// 修改用户信息
	changeUserInfo(tenantId, userId, postData){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users/${userId}`,
			{
				type: "PUT",
				data: JSON.stringify(postData)
			}
		)
		.then((data) => {
			return data.entity;
		});
	},

	// 查看群聊信息 {host}/v1/tenants/{tenantid}/groupchats/{easemobGroupId}
	getGroupInfo(tenantId, groupId, conversation, groupManager, error){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/groupchats/${groupId}`
		)
		.then((data) => {
			var createGroup = data.entity;
			// var conversation = chatManager.conversationWithType(groupId, 1);
			// var messages = conversation.loadMoreMessages(0, "", 20);
			var group = groupManager.fetchGroupSpecification(groupId, error);
			// group.groupMemberType() >=0 表示是有效的群组
			if(group.groupMemberType() >= 0){
				groupManager.fetchGroupMembers(groupId, "", 500, error);
				createGroup.owner = group.groupOwner();
				createGroup.members = group.groupMembers() || [];
				createGroup.adminMembers = group.groupAdmins() || [];
				return {
					id: group.groupId(),
					group: createGroup,
					conversation,
					// messages
				};
			}

			return {
				id: group.groupId(),
				isNotEffective: true
			};

		});
	},

	// 根据 easemobName 获取成员信息
	getMemberFromEasemob(tenantId, easemobName){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users/easemobname/${easemobName}`
		)
		.then(data => data.entity);
	},


	// 根据 easemobName 获取成员信息
	getMemberInfo(tenantId, easemobName){
		var df = $.Deferred();
		var memberInfo;
		ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users/easemobname/${easemobName}`
		)
		.done((data) => {
			memberInfo = data.entity;
			df.resolve(memberInfo);
		});
		return df.promise();
	},

	// 搜索联系人
	// {host}/v1/tenants/{tenantid}/users/search?username=XXX&page=0&size=10
	searchMember(tenantId, username, easemobName){
		return ajaxRequest(
			`${_const.domain}/v1/tenants/${tenantId}/users/search?username=${username}&page=0&size=500`
		)
		.then(
			(data) => {
				var user;
				var idx;
				data = _.filter(data.entities, dat => dat.easemobName);
				user = _.find(data, dat => dat.easemobName == easemobName);
				idx = data.indexOf(user);
				idx > -1 && data.splice(idx, 1);
				return { value: username, data };
			}
		);
	}


};
