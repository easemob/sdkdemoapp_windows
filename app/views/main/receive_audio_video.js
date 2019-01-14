
import { ipcRenderer } from "electron";

const audioAndVideo = (
	{
		userInfo,
		conversationId,
		inviterInfo,
		logintoken,
		isVideo,
		isInvited,
		isGroup,
		groupInfo,
		allMembersInfo,
		conference
	}
) => {
	setTimeout(function(){
		ipcRenderer.send(
			"receive-audio-and-video",
			userInfo,
			conversationId,
			inviterInfo,
			logintoken,
			isVideo,
			isInvited,
			isGroup,
			groupInfo,
			allMembersInfo,
			conference
		);
	}, 100)
};

module.exports = {
	audioAndVideo
};
