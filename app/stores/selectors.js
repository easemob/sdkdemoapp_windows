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

// 添加的群成员 _.difference(现在所有的群成员, 之前的群成员)
export const getAddMembers = (state) => {
	return _.pluck(state.membersOfEditGroup, "easemobName");
};

export const getRemoveMembers = (state) => {
	return _.pluck(state.membersOfDeleteGroup, "easemobName");
};

export const getAtMembersOfGroup = (state) => {
	var membersOfGroup = [];
	var user = state.userInfo.user.easemobName;
	var group = isSelectCovGroup;
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
