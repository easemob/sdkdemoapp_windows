import _ from "underscore";

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