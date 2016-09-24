#include "ChatListener.h"
#include "application.h"

string GetPathForWebPage(const string& localPath)
{
	CefStringUTF8 sURL(localPath);
	CString strPath(sURL.ToWString().c_str());
	strPath.Replace(L"\\", L"/");
	CefString sPath(strPath);
	string url = "file:///";
	url += sPath.ToString();
	return url;
}

void ChatListener::onReceiveMessages(const EMMessageList &messages) {
	while (true)
	{
		lock_guard<std::mutex> roster_guard(Utils::roster_mutex);
		lock_guard<std::mutex> group_guard(Utils::group_mutex);
		if (!Utils::g_bRosterDownloaded || !Utils::g_bGroupListDownloaded)
		{
			Sleep(100);
		}
		else
		{
			break;
		}
	}

	for (EMMessagePtr msg : messages)
	{
		EMMessage::EMChatType type = msg->chatType();
		string sChatType = "chat";
		if (type == EMMessage::GROUP)
		{
			sChatType = "groupchat";
		}
		else if (type == EMMessage::CHATROOM)
		{
			sChatType = "chatroom";
		}
		const vector<EMMessageBodyPtr> &bodies = msg->bodies();
		const EMMessageBodyPtr _body = bodies[0];
		switch (_body->type())
		{
		case EMMessageBody::TEXT:
		{
			onTextMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::FILE:
		{
			onFileMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::IMAGE:
		{
			onImageMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::VOICE:
		{
			onVoiceMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::COMMAND:
			break;
		case EMMessageBody::VIDEO:
		{
			onLocationMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::LOCATION:
		{
			onVideoMessage(msg, _body, sChatType);
			break;
		}
		}
	}
}

void ChatListener::onTextMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMTextMessageBodyPtr body = std::dynamic_pointer_cast<EMTextMessageBody, EMMessageBody>(_body);
	std::stringstream stream;
	stream << "Demo.conn.onTextMessage('{id: \"";
	stream << msg->msgId();
	stream << "\",type : \"";
	stream << sChatType;
	stream << "\", from : \"";
	stream << msg->from();
	stream << "\",to : \"";
	stream << msg->to();
	stream << "\",data : \"";
	stream << Utils::URLEncode(body->text());
	stream << "\",ext : \"\"}');";
	Utils::CallJS(stream);
}

void ChatListener::onFileMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMFileMessageBodyPtr body = std::dynamic_pointer_cast<EMFileMessageBody, EMMessageBody>(_body);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus())
		{
			std::stringstream stream;
			stream << "Demo.conn.onFileMessage('{id: \"";
			stream << msg->msgId();
			stream << "\",type : \"";
			stream << sChatType;
			stream << "\", from : \"";
			stream << msg->from();
			stream << "\",to : \"";
			stream << msg->to();
			stream << "\",url : \"";
			stream << GetPathForWebPage(body->localPath());
			stream << "\",filename : \"";
			stream << body->displayName();
			stream << "\",file_length : \"";
			stream << body->fileLength();
			stream << "\",filetype : \"";
			stream << "file";
			stream << "\",ext : \"\"}');";
			Utils::CallJS(stream);
		}
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return false;
	},
		[](int){}));
	msg->setCallback(msgCallback);

	g_client->getChatManager().downloadMessageAttachments(msg);
}

void ChatListener::onImageMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMImageMessageBodyPtr body = std::dynamic_pointer_cast<EMImageMessageBody, EMMessageBody>(_body);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus() && EMFileMessageBody::SUCCESSED == body->thumbnailDownloadStatus())
		{
			std::stringstream stream;
			stream << "Demo.conn.onPictureMessage('{id: \"";
			stream << msg->msgId();
			stream << "\",type : \"";
			stream << sChatType;
			stream << "\", from : \"";
			stream << msg->from();
			stream << "\",to : \"";
			stream << msg->to();
			stream << "\",url : \"";
			stream << GetPathForWebPage(body->localPath());
			stream << "\",filename : \"";
			stream << body->displayName();
			stream << "\",file_length : \"";
			stream << body->fileLength();
			stream << "\",filetype : \"";
			stream << "img";
			stream << "\",ext : \"\"}');";
			Utils::CallJS(stream);
		}
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return false;
	},
		[](int){}));
	msg->setCallback(msgCallback);

	g_client->getChatManager().downloadMessageAttachments(msg);
}

void ChatListener::onVoiceMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMVoiceMessageBodyPtr body = std::dynamic_pointer_cast<EMVoiceMessageBody, EMMessageBody>(_body);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus())
		{
			std::stringstream stream;
			stream << "Demo.conn.onAudioMessage('{id: \"";
			stream << msg->msgId();
			stream << "\",type : \"";
			stream << sChatType;
			stream << "\", from : \"";
			stream << msg->from();
			stream << "\",to : \"";
			stream << msg->to();
			stream << "\",url : \"";
			stream << GetPathForWebPage(body->localPath());
			stream << "\",filename : \"";
			stream << body->displayName();
			stream << "\",file_length : \"";
			stream << body->fileLength();
			stream << "\",filetype : \"";
			stream << "audio";
			stream << "\",ext : \"\"}');";
			Utils::CallJS(stream);
		}
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return false;
	},
		[](int){}));
	msg->setCallback(msgCallback);
}

void ChatListener::onVideoMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMVideoMessageBodyPtr body = std::dynamic_pointer_cast<EMVideoMessageBody, EMMessageBody>(_body);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus() && EMFileMessageBody::SUCCESSED == body->thumbnailDownloadStatus())
		{
			std::stringstream stream;
			stream << "Demo.conn.onVideoMessage('{id: \"";
			stream << msg->msgId();
			stream << "\",type : \"";
			stream << sChatType;
			stream << "\", from : \"";
			stream << msg->from();
			stream << "\",to : \"";
			stream << msg->to();
			stream << "\",url : \"";
			stream << GetPathForWebPage(body->localPath());
			stream << "\",filename : \"";
			stream << body->displayName();
			stream << "\",file_length : \"";
			stream << body->fileLength();
			stream << "\",filetype : \"";
			stream << "video";
			stream << "\",ext : \"\"}');";
			Utils::CallJS(stream);
		}
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return false;
	},
		[](int){}));
	msg->setCallback(msgCallback);

	g_client->getChatManager().downloadMessageAttachments(msg);
}

void ChatListener::onLocationMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMLocationMessageBodyPtr body = std::dynamic_pointer_cast<EMLocationMessageBody, EMMessageBody>(_body);
	std::stringstream stream;
	stream << "Demo.conn.onLocationMessage('{id: \"";
	stream << msg->msgId();
	stream << "\",type : \"";
	stream << sChatType;
	stream << "\", from : \"";
	stream << msg->from();
	stream << "\",to : \"";
	stream << msg->to();
	stream << "\",addr : \"";
	stream << body->address();
	stream << "\",lat : \"";
	stream << body->latitude();
	stream << "\",lng : \"";
	stream << body->longitude();
	stream << "\",ext : \"\"}');";
	Utils::CallJS(stream);
}
