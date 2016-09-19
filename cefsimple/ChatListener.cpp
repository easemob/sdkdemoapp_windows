#include "ChatListener.h"

void ChatListener::CallJS(const std::stringstream & stream)
{
	std::string strJSCall = stream.str();

	SimpleHandler *sh = SimpleHandler::GetInstance();
	if (sh != NULL)
	{
		CefRefPtr<CefBrowser> browser = sh->GetBrowser();
		if (browser.get())
		{
			CefRefPtr<CefFrame> frame = browser->GetMainFrame();
			if (frame.get())
			{
				frame->ExecuteJavaScript(strJSCall.c_str(), L"", 0);
			}
		}
	}
}

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
			stream << "Demo.conn.onTextMessage('{id: \"234627367585187824\",type : \"";
			stream << sChatType;
			stream << "\", from : \"";
			stream << msg->from();
			stream << "\",to : \"";
			stream << msg->to();
			stream << "\",data : \"";
			stream << body->text();
			stream << "\",ext : \"\"}');";
			CallJS(stream);
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
					stream << "Demo.conn.onFileMessage('{id: \"234627367585187824\",type : \"";
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
					CallJS(stream);
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
					stream << "Demo.conn.onPictureMessage('{id: \"234627367585187824\",type : \"";
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
					CallJS(stream);
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
					stream << "Demo.conn.onAudioMessage('{id: \"234627367585187824\",type : \"";
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
					CallJS(stream);
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
					stream << "Demo.conn.onVideoMessage('{id: \"234627367585187824\",type : \"";
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
					CallJS(stream);
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
			stream << "Demo.conn.onLocationMessage('{id: \"234627367585187824\",type : \"";
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
			CallJS(stream);
			break;
		}
		}
	}
}