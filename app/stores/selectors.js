import _ from "underscore";

// selector 的目的在这个项目里，更明确了
// 就是从 state 里选出 ui 需要的数据。
// 因为各种 loading 的关系，所以这里多出了三个新 selector：

// 拿到某个 request 状态
export const getRequest = (state, key) => state.requests[key] || {};

// 拿到所有 request 状态
export const getRequests = state => state.requests;

export const getNotice = state => state.notice;

// 是否有任何 request 正在进行
// 这个是 getRequests 传入的，所以没有 state 参数了，也是这个方法全局唯一的使用之处
export const areRequestsPending = (requests) => {
	return _.keys(requests).some(key => requests[key].status === "pending");
};

export const tenantId = state => state.userInfo && state.userInfo.user.tenantId;

export const allUnReadMsgCount = (state) => {
	var sum = 0;
	_.each(_.values(state.unReadMessageCount), (item) => {
		sum += item.length;
	});
	return sum;
};

export const getAllMembers = (state) => {
	var allMembers = _.filter(state.allMembersInfo, (item) => { return item.easemobName; });
	return _.sortBy(_.values(allMembers), "username");
};

export const membersIdArray = state =>  _.pluck(state.membersOfEditGroup, "easemobName");
export const createGroupMembersIdArray = state =>  _.pluck(state.membersOfCreateGroup, "easemobName");
export const deleteGroupMembersIdArray = state =>  _.pluck(state.membersOfDeleteGroup, "easemobName");
export const videoCallGroupMembersIdArray = function(state){
	var result = _.pluck(state.membersOfVideoGroup, "easemobName");
	return result;
};

export const membersIdOfGroup = (state) => {
	return membersIdArray(state).join(",");
};

export const membersNameOfGroup = (state) => {
	var memberArr = [];
	_.map(state.membersOfEditGroup, function(member){
		memberArr.push(member.realName || member.username || member.easemobName);
	});
	return _.uniq(memberArr).join(",");
	// return _.pluck(state.membersOfEditGroup, "realName").join(",");
};

// 群组成员(管理员和普通成员)
export const getGroupMembers = function(state){
	// var memberInfo = [];
	// var adminMemeberInfo = [];
	var members;
	var adminMembers;
	let groupOwner = state.groupChats[state.selectConversationId].owner;
	if(state.groupChats[state.selectConversationId]){
		members = state.groupChats[state.selectConversationId].members || [];
		adminMembers = state.groupChats[state.selectConversationId].adminMembers || [];
		// memberInfo = _.filter(members, (member) => {
		// 	return state.allMembersInfo[member];
		// });
		// adminMemeberInfo = _.filter(adminMembers, (member) => {
		// 	return state.allMembersInfo[member];
		// });
		return [groupOwner].concat(adminMembers).concat(members);
	}
	return [groupOwner];

};
export const getGroupAdminMembers = function(state){
	return state.groupChats[state.selectConversationId] ? state.groupChats[state.selectConversationId].adminMembers || [] : [];
};
export const getGroupOwner = (state) => {
	return state.groupChats[state.selectConversationId] ? state.groupChats[state.selectConversationId].owner : "";
};

// 获取群主和所有成员
// export const getGroupMemberAndOwner = function(state){
// 	// return getGroupOwner(state) ? [state.allMembersInfo[getGroupOwner(state)]].concat(getGroupMembers(state)) : getGroupMembers(state);
// 	var allMembers = [];
// 	var owner;
// 	if(getGroupOwner(state)){
// 		owner = state.allMembersInfo[getGroupOwner(state)];
// 		owner && allMembers.push(owner);
// 		allMembers.concat(getGroupMembers(state));
// 	}
// 	else{
// 		allMembers = getGroupMembers(state);
// 	}
// 	return allMembers;
// };

// 添加的群成员 _.difference(现在所有的群成员, 之前的群成员)
export const getAddMembers = (state) => {
	var a = _.difference(
		_.pluck(state.membersOfEditGroup, "easemobName"),
		state.groupChats[state.selectConversationId].members
	);
	return a;
};

export const getRemoveMembers = (state) => {
	return _.pluck(state.membersOfDeleteGroup, "easemobName");
};

export const getAtMembersOfGroup = (state) => {
	var membersOfGroup = [];
	var user = state.userInfo.user.easemobName;
	var group = state.groupChats[state.selectConversationId];
	var memberInfo;
	// 群主和管理员可以 @ all
	if(!group){
		return [];
	}
	if(group.owner == user || group.adminMembers.indexOf(user) > -1){
		membersOfGroup.push({ id: "all", name: "所有成员" });
	}
	_.map([group.owner].concat(group.members).concat(group.adminMembers), function(member){
		memberInfo = state.allMembersInfo[member];
		memberInfo && member != user && membersOfGroup.push({ id: memberInfo.easemobName, name: memberInfo.realName || memberInfo.easemobName });
	});
	return membersOfGroup;
};

// 按最后一条消息的时间排序
export const conversationsSort = (state) => {
	var conversations = _.values(state.conversations);
	return _.sortBy(conversations, "sortTime").reverse();

};
