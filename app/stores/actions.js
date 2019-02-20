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

export const createAGroup = payload => ({
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

// 设置好友列表
export const setAllContacts = (payload) => ({
	type:"app/setcontacts",
	payload
});

// 添加一个好友
export const addContact = (payload) => ({
	type:"app/addcontacts",
	payload
});

// 删除一个好友
export const removeContact = (payload) => ({
	type:"app/removecontacts",
	payload
});

// 设置群组列表
export const setGroupChats = (payload) => ({
	type:"app/setgroupchats",
	payload
})

// 设置当前选择的会话是否群组会话
export const setSelectConvType = (payload) => ({
	type:"app/isSelectCovGroup",
	payload
})

//  设置登录请求
export const requestLogin = (payload) => (
	{
		type: "app/setLogin",
		payload
	}
);