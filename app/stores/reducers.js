import { combineReducers } from "redux";
import _ from "underscore";
import moment from "moment";

export const globals = (state = {}, { type, payload = {} }) => {
	switch(type){
	case "app/initGlobal":
		return payload;
	default:
		return state;
	}
};

export const networkConnection = (state = "", { type, payload = "" }) => {
	switch(type){
	case "app/networkConnection":
		return payload;
	default:
		return state;
	}
};

export const userInfo = (state = null, { type, payload = {} }) => {
	switch(type){
	case "app/setLogin":
		return payload;
	case "app/setLogout":
		return {};
	case "app/changeUserInfo":
		let currentUser = state;
		currentUser.user = payload;
		return _.extend({}, state, currentUser);
	default:
		return state;
	}
};
export const allMembersInfo = (state = {}, { type, payload = {} }) => {
	var members = {};
	switch(type){
	case "app/getAllMembers":
		let activeMembers = _.filter(payload, member => member.easemobName);
		_.each(activeMembers, function(member){
			members[member.easemobName] = member;
		});
		return _.extend({}, state, members);
	case "app/getMemberInfo":
		return _.extend({}, state, { [payload.easemobName]: payload });
	case "app/searchMember":
		return _.extend({}, state, payload);
	case "app/setLogin":
		return _.extend({}, state, { [payload.user.easemobName]: payload.user });
	case "app/changeUserInfo":
	case "app/changeMemberInfo":
	case "app/addMemberInfo":
		return payload.easemobName ? _.extend({}, state, { [payload.easemobName]: payload }) : state;
	case "app/deleteMember":
		members = _.clone(state);
		members[payload.easemobName] && delete members[payload.easemobName];
		return members;
	case "app/membersOfOrg":
		_.forEach(_.values(payload)[0], function(item){
			members[item.easemobName || item.username || item.id] = item;
		});
		return _.extend({}, state, members);
	case "app/setLogout":
		return {};
	default:
		return state;
	}
};
export const rootOrgId = (state = -1, { type, payload = {} }) => {
	switch(type){
	case "app/getRootOrg":
		return payload[0].id;
	default:
		return state;
	}
};
export const orgTree = (state = {}, { type, payload = {} }) => {
	let payloadVal;
	let temp;
	let idx;
	let changeChild;
	var children;
	var tempObj = {};
	switch(type){
	case "app/getRootOrg":
		return _.extend({}, state, { [payload[0].id]: payload[0] });
	case "app/getChildOrg":
		tempObj = {};
		children = [];
		payloadVal = _.values(payload)[0];
		if(payloadVal.length){
			temp = state[payloadVal[0].parentId];
			temp.children = temp.children ? temp.children.concat(payloadVal) : payloadVal;
			children = temp.children ? temp.children.concat(payloadVal) : payloadVal;
			_.map(children, (child) => {
				tempObj[child.id] = child;
			});
			temp.children = _.values(tempObj);
			let result = _.extend({}, payload, { [payloadVal[0].parentId]: temp });
			_.forEach(payloadVal, function(item){
				result[item.id] = item;
			});
			return _.extend({}, state, result);
		}
		return state;
	case "app/membersOfOrg":
		tempObj = {};
		children = [];
		payloadVal = _.values(payload)[0];
		if(payloadVal.length){
			temp = state[payloadVal[0].organizationId];
			if(temp){
				children = temp.children ? temp.children.concat(payloadVal) : payloadVal;
				_.map(children, (child) => {
					tempObj[child.id] = child;
				});
				temp.children = _.values(tempObj);
				return _.extend({}, state, { [payloadVal[0].organizationId]: temp });
			}
			return state;
		}
		return state;

	// 新增成员
	case "app/addMemberInfo":
		temp = _.clone(state[payload.organizationId]);
		temp.children = temp.children || [];
		temp.children.push(payload);
		return _.extend({}, state, { [temp.id]: temp });
	// 新增部门
	case "app/addOrg":
		temp = _.clone(state);
		temp[payload.parentId].children = temp[payload.parentId].children || [];
		temp[payload.parentId].children.push(payload);
		return _.extend({}, state, temp);
	// 修改部门
	case "app/changeOrg":
		temp = _.clone(state);
		if(temp){
			_.map(temp[payload.parentId].children, (child, index) => {
				if(child.id == payload.id){
					idx = index;
				}
			});
			if(temp[payload.parentId].children){

				changeChild = temp[payload.parentId].children[idx];
				if(changeChild.children){
					payload.children = changeChild.children;
				}
				temp[payload.parentId].children.splice(idx, 1, payload);
				temp[payload.id] = payload;
				return temp;
			}
			return state;
		}
		return state;
	// 删除部门
	case "app/removeOrg":
		temp = _.clone(state);
		_.map(temp[payload.parentId].children, (child, index) => {
			if(child.id == payload.id){
				idx = index;
			}
		});
		idx > -1 && temp[payload.parentId].children.splice(idx, 1);
		temp[payload.id] && delete temp[payload.id];
		return temp;
	default:
		return state;
	}
};

export const selectMember = (state = {}, { type, payload = {} }) => {
	switch(type){
	case "app/selectMember":
		return payload;
	case "app/setLogout":
		return {};
	case "app/changeMemberInfo":
		return payload.id == state.id ? payload : state;
	default:
		return state;
	}
};

export const openMenuKeys = (state = [], { type, payload = [] }) => {
	switch(type){
	case "app/getRootOrg":
		return [`${payload[0].id}`];
	case "app/openSubMenu":
		return payload;
	case "app/openCurrentMenu":
		const openKeys = state;
		return openKeys.concat(payload);
	default:
		return state;
	}
};

export const selectConversationId = (state = "", { type, payload = "" }) => {
	switch(type){
	case "app/selectConversation":
		return payload;
	case "app/createGroup":
		return payload.easemobGroupId;
	case "app/destoryGroup":
	case "app/leaveGroup":
	case "app/deleteConversation":
		return "";
	case "app/setLogout":
		return "";
	case "app/deleteMember":
		return payload.easemobName == state ? "" : state;
	default:
		return state;
	}
};

export const selectNav = (state = "", { type, payload = "" }) => {
	switch(type){
	case "app/selectNav":
		return payload;
	default:
		return state;
	}
};

export const messages = (state = {}, { type, payload = {} }) => {
	let msgArr;
	let recallMsg;
	switch(type){
	case "app/initConversations":
		msgArr = Array.from(new Set(payload.msgs));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/msgsOfConversation":
		// msgArr = state[payload.id] || [];
		// msgArr = payload.msgs.concat(msgArr);
		// return _.extend({}, state, { [payload.id]: msgArr });
		msgArr = Array.from(new Set(payload.msgs));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/createGroup":
		return _.extend({}, state, { [payload.easemobGroupId]: [] });
	case "app/msgsOfHistory":
		msgArr = state[payload.id] || [];
		msgArr = Array.from(new Set(payload.msgs.concat(msgArr)));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/sendMsg":
		msgArr = state[payload.id] || [];
		msgArr.push(payload.msg);
		msgArr = Array.from(new Set(msgArr));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/receiveMsg":
		msgArr = Array.from(new Set(payload.messages));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/clearAllMessages":
		return _.extend({}, state, { [payload.id]: [] });
	case "app/setLogout":
		return {};
	case "app/memberLeftGroup":
		msgArr = Array.from(new Set(payload.messages));
		return _.extend({}, state, { [payload.id]: msgArr });
	case "app/recallMessage":
		recallMsg = _.find(payload.messages, function(msg){
			return msg.msgId() == payload.recallMsg.msgId();
		});

		payload.insertMsg.setLocalTime(recallMsg.localTime());
		payload.insertMsg.setTimestamp(recallMsg.timestamp());

		payload.messages.splice(payload.messages.indexOf(recallMsg), 1, payload.insertMsg);
		payload.conversation.insertMessage(payload.insertMsg);
		return _.extend({}, state, { [payload.id]: payload.messages });
	// 删除消息
	case "app/deleteMessage":
		payload.messages.splice(payload.messages.indexOf(payload.deleteMsg), 1);
		return _.extend({}, state, { [payload.id]: payload.messages });
	default:
		return state;

	}
};

export const conversations = (state = {}, { type, payload = {} }) => {
	var convers;
	let lastmsg;
	switch(type){
	case "app/initConversations":
		lastmsg = payload.conversation.latestMessage();
		payload.conversation.sortTime = lastmsg.localTime();
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/msgsOfConversation":
		payload.conversation.sortTime = moment().format("x");
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/selectConversationOfList":
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/createGroup":
		lastmsg = payload.conversation.latestMessage();
		payload.conversation.sortTime = lastmsg ? lastmsg.localTime() : payload.conversation.sortTime || moment().format("x");
		return _.extend({}, state, { [payload.easemobGroupId]: payload.conversation });
	case "app/joinGroup":
		lastmsg = payload.conversation.latestMessage();
		payload.conversation.sortTime = lastmsg ? lastmsg.localTime() : payload.conversation.sortTime || moment().format("x");
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/getGroupInfo":
		if(payload.isNotEffective){
			delete state[payload.id];
			return state;
		}
		lastmsg = payload.conversation.latestMessage();
		payload.conversation.sortTime = lastmsg ? lastmsg.localTime() : payload.conversation.sortTime || moment().format("x");
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/receiveMsg":
		lastmsg = payload.conversation.latestMessage();
		payload.conversation.sortTime = lastmsg ? lastmsg.localTime() : payload.conversation.sortTime || moment().format("x");
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/sendMsg":
		payload.conversation.sortTime = payload.msg.localTime();
		return _.extend({}, state, { [payload.id]: payload.conversation });
	case "app/destoryGroup":
	case "app/leaveGroup":
	case "app/deleteConversation":
		convers = _.clone(state);
		delete convers[payload];
		return convers;
	case "app/setLogout":
		return {};
	case "app/deleteMember":
		convers = _.clone(state);
		delete convers[payload.easemobName];
		return convers;
	default:
		return state;
	}
};

export const unReadMessageCount = (state = {}, { type, payload }) => {
	switch(type){
	case "app/unReadMsgCount":
		return _.extend({}, state, { [payload.id]: payload.unReadMsg || [] });
	case "app/receiveMsg":
		let conversationUnReadMsg = _.flatten((state[payload.id] || []).concat([payload.unReadMsg]));
		return _.extend({}, state, { [payload.id]: conversationUnReadMsg });
	case "app/deleteConversation":
		return _.extend({}, state, { [payload]: [] });
	case "app/setLogout":
		return {};
	case "app/leaveGroup":
		return _.extend({}, state, { [payload]: [] });
	default:
		return state;
	}
};

export const membersOfCreateGroup = (state = [], { type, payload }) => {
	switch(type){
	case "app/selectMembersOfGroup":
		return state.concat(payload);
	case "app/cancelMembersOfGroup":
		return _.filter(state, (item) => { return item.easemobName != payload;});
	case "app/createGroup":
	case "app/cancelCreateGroup":
	case "app/cancelEditGroup":
	case "app/inveitMembers":
		return [];
	default:
		return state;
	}
};

export const membersOfEditGroup = (state = [], { type, payload = [] }) => {
	switch(type){
	case "app/selectMembersOfGroup":
		return state.concat(payload);
	case "app/cancelMembersOfGroup":
		return _.filter(state, (item) => { return item.easemobName != payload;});
	case "app/cancelEditGroup":
	case "app/cancelCreateGroup":
	case "app/inveitMembers":
		return [];
	default:
		return state;
	}
};

export const membersOfDeleteGroup = (state = [], { type, payload = [] }) => {
	switch(type){
	case "app/selectDelMembersOfGroup":
		return state.concat(payload);
	case "app/cancelDelMembersOfGroup":
		return _.filter(state, (item) => { return item.easemobName != payload.easemobName;});
	case "app/cancelDeleteGroup":
	case "app/inveitMembers":
		return [];
	default:
		return state;
	}
};

// 群视频邀请的成员
export const membersOfVideoGroup = (state = [], { type, payload = [] }) => {
	switch(type){
	case "app/selectVideoMembersOfGroup":
		return state.concat(payload);
	case "app/cancelVideoMembersOfGroup":
		return _.filter(state, (item) => { return item.easemobName != payload.easemobName;});
	case "app/cancelVideoGroup":
		return [];
	default:
		return state;
	}
};

export const groupChats = (state = {}, { type, payload }) => {
	let group;
	let idxOfAdmins;
	let idxOfMembers;
	switch(type){
	case "app/createGroup":
		return _.extend({}, state, { [payload.easemobGroupId]: payload });
	case "app/getGroupChats":
		let groups = {};
		_.each(payload, function(group){
			groups[group.easemobGroupId] = group;
		});
		return _.extend({}, state, groups);
	// 从 sdk 获取到的 owner 和 members
	case "app/getGroupMembers":
		if(payload.groupInfo.owner){
			group = _.extend({}, state[payload.id], payload.groupInfo);
			return _.extend({}, state, { [payload.id]: group });
		}
		return state;
	case "app/editMembersOfGroup":
		group = state[payload.id];
		group.members = payload.members;
		group.adminMembers = payload.adminMembers || [];
		return _.extend({}, state, { [payload.id]: group });
	// 修改群信息
	case "app/changeGroupInfo":
		group = state[payload.id];
		group.chatName = payload.chatName;
		group.avatar = payload.avatar;
		return _.extend({}, state, { [payload.id]: group });
	// 更改群主
	case "app/setOwner":
		group = payload.group;
		group.adminMembers = group.adminMembers || [];
		idxOfMembers = group.members.indexOf(payload.owner);
		idxOfAdmins = group.adminMembers.indexOf(payload.owner);
		if(idxOfMembers >= 0){
			// 从成员列表里删除
			group.members.splice(idxOfMembers, 1);
		}
		else if(idxOfAdmins >= 0){
			// 从管理员列表里删除
			group.adminMembers.splice(idxOfAdmins, 1);
		}
		group.members.push(group.owner);
		group.owner = payload.owner;
		return _.extend({}, state, { [payload.id]: group });
	// 设为管理员
	case "app/setAdmin":
		payload.group.adminMembers = payload.group.adminMembers || [];
		idxOfAdmins = payload.group.members.indexOf(payload.adminMember);
		payload.group.members.splice(idxOfAdmins, 1);
		payload.group.adminMembers.push(payload.adminMember);
		return _.extend({}, state, { [payload.id]: payload.group });
	// 取消管理员
	case "app/cancelAdmin":
		payload.group.adminMembers = payload.group.adminMembers || [];
		idxOfAdmins = payload.group.adminMembers.indexOf(payload.adminMember);
		payload.group.adminMembers.splice(idxOfAdmins, 1);
		payload.group.members.push(payload.adminMember);
		return _.extend({}, state, { [payload.id]: payload.group });
	case "app/inveitMembers":
		group = state[payload.id];
		group.members = group.members.concat(payload.members);
		return _.extend({}, state, { [payload.id]: group });
	case "app/memberJoinedGroup":
		group.members.push(payload.member);
		return _.extend({}, state, { [payload.id]: group });
	case "app/removeMembers":
		// group = state[payload.id];
		payload.group.members = _.difference(payload.group.members, payload.members);
		return _.extend({}, state, { [payload.id]: payload.group });
	case "app/destoryGroup":
	case "app/leaveGroup":
		delete state[payload];
		return state;
	case "app/setLogout":
		return {};
	case "app/joinGroup":
		return _.extend({}, state, { [payload.id]: payload });
	case "app/memberLeftGroup":
		group = state[payload.id];
		if(group){
			group.adminMembers = group.adminMembers || [];
			idxOfMembers = group.members.indexOf(payload.member);
			idxOfAdmins = group.adminMembers.indexOf(payload.member);
			if(idxOfMembers >= 0){
				group.members.splice(group.members.indexOf(payload.member), 1);
			}
			else if(idxOfAdmins >= 0){
				group.adminMembers.splice(group.adminMembers.indexOf(payload.member), 1);
			}
			return _.extend({}, state, { [payload.id]: group });
		}
		return state;
	case "app/getGroupInfo":
		if(payload.isNotEffective){
			delete state[payload.id];
			return state;
		}
		return _.extend({}, state, { [payload.id]: payload.group });
	default:
		return state;
	}
};

export const selectGroup = (state = {}, { type, payload }) => {
	switch(type){
	case "app/selectOfGroup":
		return payload;
	// case "app/createGroup":
	// 	return  payload;
	case "app/destoryGroup":
	case "app/leaveGroup":
		return {};
	case "app/setLogout":
		return {};
	default:
		return state;
	}
};

export const searchGroups = (state = {}, { type, payload }) => {
	var group;
	var searchList = {};
	switch(type){
	case "app/searchGroup":
		if(!payload.value){
			return {};
		}
		_.map(_.keys(payload.groupChats), (groupId) => {
			group = payload.groupChats[groupId];
			if(
				group &&
				(group.chatName && group.chatName.indexOf(payload.value) >= 0)
			){
				searchList[groupId] = group;
			}
		});
		return searchList;
	default:
		return state;
	}
};

export const searchConcatMembers = (state = {}, { type, payload }) => {
	switch(type){
	case "app/searchMembersOfConcat":
		if(!payload.value){
			return {};
		}
		return payload.data;
	default:
		return state;
	}
};

export const hashOrgAndMember = (state = {}, { type, payload = {} }) => {
	let temp;
	switch(type){
	case "app/membersOfOrg":
		temp = {};
		_.forEach(_.values(payload)[0], function(item){
			temp[item.easemobName || item.username || item.id] = item;
		});
		return _.extend({}, state, temp);

	case "app/addMemberInfo":
		return _.extend({}, state, { [payload.easemobName || payload.username]: payload });

	case "app/changeMemberInfo":
		temp = state[payload.username];
		return (
			temp
				? _.extend({}, state, { [payload.username]: payload })
				: _.extend({}, state, { [payload.easemobName || payload.username]: payload })
		);
	default:
		return state;
	}
};

const notice = (state = {}, { type, payload }) => {
	switch(type){
	case "app/setNotice":
		return payload;
	case "app/clearNotice":
		return state;
	default:
		return state;
	}
};

const groupAtMsgs = (state = {}, { type, payload }) => {
	switch(type){
	case "app/receiveAtMsg":
		return _.extend({}, state, payload);
	case "app/msgsOfConversation":
	case "app/selectConversationOfList":
		if(state[payload.id]){
			delete state[payload.id];
		}
		return state;
	default:
		return state;
	}
};

const searchMemberOfCreateGroup = (state = {}, { type, payload }) => {
	switch(type){
	case "app/searchMember":
		return payload;
	default:
		return state;
	}
};

const conferenceMsg = (state = {}, { type, payload }) => {
	switch(type){
	case "app/conference":
		return payload;
	default:
		return state;
	}
};

// action payload 就附带上了我们异步工具中的所有变量了
// 并没有删除记录的处理，不需要！
export const requests = (state = {}, { type, payload, meta }) => {
	switch(type){
	case "app/markRequestPending":
		return { [meta.key]: { status: "pending", error: null } };
	case "app/markRequestSuccess":
		return { [meta.key]: { status: "success", error: null } };
	case "app/markRequestFailed":
		return { [meta.key]: { status: "failure", error: payload } };
	default:
		return state;
	}
};

export default combineReducers({
	globals,
	networkConnection,
	userInfo,
	requests,
	orgTree,
	rootOrgId,
	selectMember,
	hashOrgAndMember,
	selectConversationId,
	selectNav,
	messages,
	conversations,
	openMenuKeys,
	unReadMessageCount,
	notice,
	allMembersInfo,
	membersOfCreateGroup,
	membersOfEditGroup,
	membersOfDeleteGroup,
	membersOfVideoGroup,
	groupChats,
	selectGroup,
	searchConcatMembers,
	searchGroups,
	groupAtMsgs,
	searchMemberOfCreateGroup,
	conferenceMsg
});
