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
			stream << body->text();
			stream << "\",ext : \"\"}');";
			Utils::CallJS(stream);
			break;
		}
		case EMMessageBody::FILE:
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
			break;
		}
		case EMMessageBody::IMAGE:
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
			break;
		}
		case EMMessageBody::VOICE:
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

			break;
		}


		case EMMessageBody::COMMAND:
			break;
		case EMMessageBody::VIDEO:
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
			break;
		}
		case EMMessageBody::LOCATION:
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
			break;
		}
		}
	}
}