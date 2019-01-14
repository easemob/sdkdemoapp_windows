// 收到的监听事件

import _ from "underscore";
import { ipcRenderer } from "electron";

const throttleUpdate = _.throttle(function(message){
	console.log(new Date());
	if(message.getJsonAttribute("devices").indexOf("pc") > -1){
		ipcRenderer.send("receive-client-upgrade");
	}
}, 10000, { leading: false });

const userChange = (messages, props) => {
	const {
		addMemberInfoAction,
		changeMemberInfoAction,
		deleteMemberAction,
		changeGroupInfo,
		addOrgAction,
		changeOrgAction,
		removeOrgAction,
		requestChildOrg,
		requestMembersOfOrg
	} = props;
	var action;
	var users;
	var groups;
	var orgs;
	var tenantId;
	var organizationId;
	var parentId;
	_.map(messages, (message) => {
		action = message.bodies()[0].action();
		switch(action){
		// 客户端有更新
		case "oa_client_upgrade":
			console.log("oa_client_upgrade", new Date());
			throttleUpdate(message);
			break;
		// 同一账号接通音视频的通知
		case "oa_client_sync":
			console.log("oa_client_sync");
			if(message.getJsonAttribute("sync_device") == "mobile"){
				let conferenceId = JSON.parse(message.getJsonAttribute("sync_event")).conference_id;
				console.log("已在其他设备处理");
				ipcRenderer.send("audio-video-client-sync", conferenceId);
			}
			break;
		// 发生在对方收到邀请，未接受时，己方挂断，发送的消息。
		case "conf_action_cancel":
			console.log("conf_action_cancel");
			let confrId = JSON.parse(message.getAttribute("conference")).confrId;
			let isGroup = false;
			if(message.from() != message.to()){
				ipcRenderer.send(
					"audio-video-receive-hangup",
					confrId,
					message.from(),
					message.from(),
					message.to(),
					isGroup
				);
			}
			break;
		// 发生在接通后，转接到语音时发送的消息
		// cmd: {action:"conf_forwardto_voice", "ext":{"conference":{"confrId":""}}}
		case "conf_forwardto_voice":
			console.log("conf_forwardto_voice");
			ipcRenderer.send("audio-video-forwardto_voice");
			break;
		case "oa_users_changed":
			users = message.getAttribute("users");
			_.map(eval(users), (user) => {
				changeMemberInfoAction(user);
			});
			break;

		case "oa_users_added":
			users = eval(message.getAttribute("users"));
			tenantId = users[0].tenantId;
			organizationId = users[0].organizationId;
			// 去获取下父级部门下的部门和成员
			requestChildOrg(tenantId, organizationId);
			requestMembersOfOrg(tenantId, organizationId);
			// _.map(users, (user) => {
			// 	addMemberInfoAction(user);
			// });
			break;

		case "oa_users_removed":
			// users = message.getAttribute("users");
			// _.map(eval(users), (user) => {
			// 	deleteMemberAction(user);
			// });
			break;

		// 群信息更新
		case "oa_groups_changed":
			groups =  message.getAttribute("groups");
			_.map(eval(groups), (group) => {
				group.chatName = group.name || "";
				group.name && delete group.name;
				changeGroupInfo(group);
			});
			break;

		// 人员批量导入
		case "oa_users_refresh":
			break;

		// 新增部门
			// {"msg":{"type":"cmd", "action":"oa_orgs_added"}, "ext":{"orgs":[{},{}]}}
		case "oa_orgs_added":
			orgs = eval(message.getAttribute("orgs"));
			tenantId = orgs[0].tenantId;
			parentId = orgs[0].parentId;
			// 去获取下父级部门下的部门和成员
			requestChildOrg(tenantId, parentId);
			requestMembersOfOrg(tenantId, parentId);
			// _.map(orgs, (org) => {
			// 	addOrgAction(org);
			// });
			break;

		// 部门信息更改
			// {"msg":{"type":"cmd", "action":"oa_orgs_changed"}, "ext":{"orgs":[{},{}]}}
		case "oa_orgs_changed":
			orgs = message.getAttribute("orgs");
			_.map(eval(orgs), (org) => {
				changeOrgAction(org);
			});
			break;

		// 部门被移除
			// {"msg":{"type":"cmd", "action":"oa_orgs_removed"}, "ext":{"orgs":[{},{}]}}
		case "oa_orgs_removed":
			// orgs = message.getAttribute("orgs");
			// _.map(eval(orgs), (org) => {
			// 	removeOrgAction(org);
			// });
			break;

		// 部门信息更新 当批量导入部门时
			// {"msg":{"type":"cmd", "action":"oa_orgs_refresh"}}
		case "oa_orgs_refresh":
			break;

		// 角色被更新 角色被更改：需重新获取角色信息
		// {"msg":{"type":"cmd", "action":"oa_roles_refresh"}}
		case "oa_roles_refresh":
			break;

		default:
			break;
		}

	});
};

module.exports = {
	userChange
};
