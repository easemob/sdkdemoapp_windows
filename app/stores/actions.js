import api from "../api";

export const globalAction = payload => ({
	type: "app/initGlobal",
	payload
});
export const networkConnectAction = payload => ({
	type: "app/networkConnection",
	payload
});
export const loginState = payload => ({
	type: "app/setLogin",
	payload,
});
export const logout = payload => ({
	type: "app/setLogout",
	payload
});
export const rootOrg = payload => ({
	type: "app/getRootOrg",
	payload
});
export const childOrg = payload => ({
	type: "app/getChildOrg",
	payload
});
export const membersOfOrg = payload => ({
	type: "app/membersOfOrg",
	payload
});
export const getAllMembers = payload => ({
	type: "app/getAllMembers",
	payload
});
export const memberOfSelect = payload => ({
	type: "app/selectMember",
	payload
});
export const setMemberInfo = payload => ({
	type: "app/setMemberInfo",
	payload
});
export const keysOfOpenMenu = payload => ({
	type: "app/openSubMenu",
	payload
});
export const keyOfCurrentOpenMenu = payload => ({
	type: "app/openCurrentMenu",
	payload
});
export const conversationOfSelect = payload => ({
	type: "app/selectConversation",
	payload
});
export const msgsOfConversation = payload => ({
	type: "app/msgsOfConversation",
	payload
});
export const selectConversationOfList = payload => ({
	type: "app/selectConversationOfList",
	payload
});
export const initConversationsActiton = payload => ({
	type: "app/initConversations",
	payload
});
export const msgsOfHistory = payload => ({
	type: "app/msgsOfHistory",
	payload
});
export const sendMsg = payload => ({
	type: "app/sendMsg",
	payload
});
export const receiveMsgAction = payload => ({
	type: "app/receiveMsg",
	payload
});
export const selectMembersAction = payload => ({
	type: "app/selectMembersOfGroup",
	payload
});
export const cancelMembersAction = payload => ({
	type: "app/cancelMembersOfGroup",
	payload
});
export const cancelCreateGroupAction = payload => ({
	type: "app/cancelCreateGroup",
	payload
});
export const editMembersGroupAction = payload => ({
	type: "app/editMembersOfGroup",
	payload
});
export const cancelEditGroupAction = payload => ({
	type: "app/cancelEditGroup",
	payload
});

export const selectDelMembersAction = payload => ({
	type: "app/selectDelMembersOfGroup",
	payload
});
export const cancelDelMembersAction = payload => ({
	type: "app/cancelDelMembersOfGroup",
	payload
});

export const selectVideoMembersAction = payload => ({
	type: "app/selectVideoMembersOfGroup",
	payload
});
export const cancelVideoMembersAction = payload => ({
	type: "app/cancelVideoMembersOfGroup",
	payload
});
export const cancelVideoGroupAction = payload => ({
	type: "app/cancelVideoGroup",
	payload
});

export const cancelRemoveGroupAction = payload => ({
	type: "app/cancelDeleteGroup",
	payload
});
export const groupManagerAction = payload => ({
	type: "app/groupManager",
	payload
});

export const selectNavAction = payload => ({
	type: "app/selectNav",
	payload
});

// 人员信息
export const getMemberInfoAction = payload => ({
	type: "app/getMemberInfo",
	payload
});

// 修改群信息
export const changeGroupInfo = payload => ({
	type: "app/changeGroupInfo",
	payload
});
// 设置为群主
export const setOwnerAction = payload => ({
	type: "app/setOwner",
	payload
});

// 设为管理员
export const setAdminAction = payload => ({
	type: "app/setAdmin",
	payload
});
// 取消管理员
export const cancelAdminAction = payload => ({
	type: "app/cancelAdmin",
	payload
});

// 邀请群成员
export const inviteMemberAction = payload => ({
	type: "app/inveitMembers",
	payload
});

// 收到入群的通知
export const receiveMemberJoinGroupAction = payload => ({
	type: "app/memberJoinedGroup",
	payload
});

export const createGroup = payload => ({
	type: "app/createGroup",
	payload
});

export const getGroupChats = payload => ({
	type: "app/getGroupChats",
	payload
});

export const selectOfGroup = payload => ({
	type: "app/selectOfGroup",
	payload
});

// 删除群成员
export const removeMemberAction = payload => ({
	type: "app/removeMembers",
	payload
});

// 成员离开群
export const memberLeftGroupAction = payload => ({
	type: "app/memberLeftGroup",
	payload
});

// 退出群
export const leaveGroupAction = payload => ({
	type: "app/leaveGroup",
	payload
});
// 解散群
export const destoryGroup = payload => ({
	type: "app/destoryGroup",
	payload
});

// 收到别人邀请我入群的通知
export const receiveJoinGroupAction = payload => ({
	type: "app/joinGroup",
	payload
});

// 清空聊天记录
export const clearAllMessagesAction = payload => ({
	type: "app/clearAllMessages",
	payload
});

// 搜索会话中的联系人
export const searchConversationAction = payload => ({
	type: "app/searchConversationAction",
	payload
});

// 删除会话
export const deleteConversationAction = payload => ({
	type: "app/deleteConversation",
	payload
});
//
export const changeGroupInfoAction = payload => ({
	type: "app/getGroupMembers",
	payload
});

// 修改用户信息
export const changeUserInfo = payload => ({
	type: "app/changeUserInfo",
	payload
});

// 新增成员
export const addMemberInfoAction = payload => ({
	type: "app/addMemberInfo",
	payload
});

// 新增部门
export const addOrgAction = payload => ({
	type: "app/addOrg",
	payload
});

// 修改部门信息
export const changeOrgAction = payload => ({
	type: "app/changeOrg",
	payload
});

// 删除部门
export const removeOrgAction = payload => ({
	type: "app/removeOrg",
	payload
});

// 通讯录信息变更
export const changeMemberInfoAction = payload => ({
	type: "app/changeMemberInfo",
	payload
});
export const deleteMemberAction = payload => ({
	type: "app/deleteMember",
	payload
});

//
export const getGroupInfo = payload => ({
	type: "app/getGroupInfo",
	payload
});

// 消息撤回
export const recallMessageAction = payload => ({
	type: "app/recallMessage",
	payload
});

// 消息删除
export const deleteMessageAction = payload => ({
	type: "app/deleteMessage",
	payload
});

// 群 @
export const groupAtAction = payload => ({
	type: "app/receiveAtMsg",
	payload
});

// 设置未读消息数
export const unReadMsgCountAction = payload => ({
	type: "app/unReadMsgCount",
	payload
});

// 音视频消息
export const conferenceAction = payload => ({
	type: "app/conference",
	payload
});

export const setNotice = (content, level = "success") => ({
	type: "app/setNotice",
	payload: {
		content,
		level,
	},
});

// 创建群组时搜索成员
export const searchMember = payload => ({
	type: "app/searchMember",
	payload
});

// 搜索联系人
export const searchMembersOfConcat = payload => ({
	type: "app/searchMembersOfConcat",
	payload
});

// 搜索群组
export const searchGroupAction = payload => ({
	type: "app/searchGroup",
	payload
});

export const clearNotice = () => ({
	type: "app/clearNotice",
});

export const markRequestPending = key => ({
	type: "app/markRequestPending",
	meta: { key },
});

// 生成一个 action creator，用来 dispatch initial action 事件。
// 当请求开始 meta.done 需要 false。此时并不需要 payload。
export const markRequestSuccess = key => ({
	type: "app/markRequestSuccess",
	meta: { key },
});

// 当请求成功则需要 dispatch success action 事件。此时需要 meta.done 设为 true，以便标记请求已完成。
// 注意此时不需要 error 属性，这样就能知道带的 payload 是一个 success 的 payload。
export const markRequestFailed = (reason, key) => ({
	type: "app/markRequestFailed",
	payload: reason,
	meta: { key },
});

export const createRequestThunk = ({ request, key, start = [], success = [], failure = [] }) => {

	// view 中调用的其实是这个函数了
	return (...args) =>
		// redux-thunk 捕获到后，直接调用塞进来的，两个参数：dispatch & getState
		// 怎么捕获的？wrap 了 props。
		(dispatch) => {
			const requestKey = (typeof key === "function") ? key(...args) : key;
			// 告知开始的一系列事件
			// dispatch 就是进入 reducer 的，在那边会自然扩充 state.requests
			start.forEach(actionCreator => dispatch(actionCreator()));
			dispatch(markRequestPending(requestKey));
			// 立即请求
			return request(...args)
			.then((data) => {
				// 1. 外部添加多个 action creator 栈，顺序执行
				// data 已经被 filter 过，不会有问题
				success.forEach(actionCreator => dispatch(actionCreator(data, requestKey)));
				// 2. 将生成的 request key 传入所有的 action creators
				dispatch(markRequestSuccess(requestKey));
			})
			["catch"]((reason) => {
				failure.forEach(actionCreator => dispatch(actionCreator(reason)));
				dispatch(markRequestFailed(reason, requestKey));
			});
		};
};

export const requestLogin = createRequestThunk({
	request: api.login,
	key: "login",
	success: [
		loginState,
	],
	failure: [
		() => setNotice("用户名或密码错误", "fail"),
	],
});



export const requestChildOrg = createRequestThunk({
	request: api.getChildOrg,
	key: "getChildOrg",
	success: [
		childOrg,
	],
});

export const requestMembersOfOrg = createRequestThunk({
	request: api.getMembersOfOrg,
	key: "getMembersOfOrg",
	success: [
		membersOfOrg,
	],
});

export const requestRootOrg = createRequestThunk({
	request: api.getRootOrg,
	key: "getRootOrg",
	success: [
		data => requestChildOrg(data[0].tenantId, data[0].id),
		data => requestMembersOfOrg(data[0].tenantId, data[0].id),
		rootOrg,
	],
});

export const requestAllMembers = createRequestThunk({
	request: api.getAllMembers,
	key: "getAllMembers",
	success: [
		getAllMembers,
	],
});

export const requestCreateGroup = createRequestThunk({
	request: api.createGroup,
	key: "createGroup",
	success: [
		createGroup,
	],
});

export const requestGroups = createRequestThunk({
	request: api.getGroupChats,
	key: "getGroupChats",
	success: [
		getGroupChats,
	],
});

export const requestDestoryGroup = createRequestThunk({
	request: api.destoryGroup,
	key: "destoryGroup",
	success: [
		destoryGroup,
	],
});

// 修改群信息
export const requestChantGroupInfo = createRequestThunk({
	request: api.changeGroupInfo,
	key: "changeGroupInfo",
	success: [
		changeGroupInfo,
		() => setNotice("修改成功", "success"),
	],
	failure: [
		() => setNotice("保存失败", "fail"),
	],
});

// 修改个人信息
export const requestChangeUserInfo = createRequestThunk({
	request: api.changeUserInfo,
	key: "changeUserInfo",
	success: [
		changeUserInfo,
		() => setNotice("修改成功", "success"),

	],
	failure: [
		() => setNotice("保存失败", "fail"),
	],
});

// 查看群聊信息
export const requestGroupInfo = createRequestThunk({
	request: api.getGroupInfo,
	key: "getGroupInfo",
	success: [
		getGroupInfo,
	],
});

// 获取成员信息
export const requestMemberInfo = createRequestThunk({
	request: api.getMemberFromEasemob,
	key: "getMemberFromEasemob",
	success: [
		getMemberInfoAction,
	],
});

// 搜索联系人
export const requestSearchMember = createRequestThunk({
	request: api.searchMember,
	key: "searchMembersOfConcat",
	success: [
		searchMembersOfConcat
	]
});

//
export const requestDownloadAvatar = createRequestThunk({
	request: api.getAvatar,
});
