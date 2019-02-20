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
