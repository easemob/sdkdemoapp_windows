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

void ChatListener::onReceiveMessages(const EMMessageList &messages) 
{
	HANDLE hObject[2];
	hObject[0] = Utils::g_RosterDownloaded;
	hObject[1] = Utils::g_GroupListDownloaded;
	WaitForMultipleObjects(2, hObject, TRUE, INFINITE);


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
			onVideoMessage(msg, _body, sChatType);
			break;
		}
		case EMMessageBody::LOCATION:
		{
			onLocationMessage(msg, _body, sChatType);
			break;
		}
		}
	}
}

void ChatListener::onTextMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	string sRoomType = "undefined";
	if (sChatType.compare("groupchat") == 0)
	{
		sRoomType = "groups";
	}
	else if (sChatType.compare("chatroom") == 0)
	{
		sChatType = "groupchat";
		sRoomType = "chatrooms";
	}

	EMTextMessageBodyPtr body = std::dynamic_pointer_cast<EMTextMessageBody, EMMessageBody>(_body);
	std::stringstream stream;
	stream << "Demo.conn.onTextMessage('{id: \"";
	stream << msg->msgId();
	stream << "\",type : \"";
	stream << sChatType;
	stream << "\", roomtype : \"";
	stream << sRoomType;
	stream << "\", from : \"";
	stream << msg->from();
	stream << "\",to : \"";
	stream << msg->to();
	stream << "\",data : \"";
	stream << Utils::URLEncode(body->text());
	stream << "\",ext : \"\"}');";
	Utils::CallJS(stream);
}

string ChatListener::getJSHead(const EMMessagePtr msg, string sChatType, string JSFuncName)
{
	string sRoomType = "undefined";
	if (sChatType.compare("groupchat") == 0)
	{
		sRoomType = "groups";
	}
	else if (sChatType.compare("chatroom") == 0)
	{
		sChatType = "groupchat";
		sRoomType = "chatrooms";
	}

	std::stringstream streamHead;
	streamHead << "Demo.conn.";
	streamHead << JSFuncName;
	streamHead << "('{ext : \"\",id: \"";
	streamHead << msg->msgId();
	streamHead << "\",type : \"";
	streamHead << sChatType;
	streamHead << "\", roomtype : \"";
	streamHead << sRoomType;
	streamHead << "\", from : \"";
	streamHead << msg->from();
	streamHead << "\",to : \"";
	streamHead << msg->to();
	streamHead << "\",url : \"";
	string sRet = streamHead.str();
	streamHead.clear();
	streamHead.str("");
	return sRet;
}

string ChatListener::getJSTail(const EMMessageBodyPtr _body, string type)
{
	EMFileMessageBodyPtr body = std::dynamic_pointer_cast<EMFileMessageBody, EMMessageBody>(_body);
	std::stringstream streamTail;
	streamTail << "\",filename : \"";
	streamTail << body->displayName();
	streamTail << "\",file_length : \"";
	streamTail << body->fileLength();
	streamTail << "\",filetype : \"";
	streamTail << type;
	streamTail << "\"}');";
	string sRet = streamTail.str();
	streamTail.clear();
	streamTail.str("");
	return sRet;
}

void ChatListener::CallJSWithoutFilePath(string strJSHead, string strJSTail)
{
	std::stringstream stream;
	stream << strJSHead;
	stream << strJSTail;
	Utils::CallJS(stream);
	stream.clear();
	stream.str("");
}

void ChatListener::CallJSWithFilePath(string strJSHead, string strJSTail, string strPath)
{
	std::stringstream streamAll;
	streamAll << strJSHead;
	streamAll << strPath;
	streamAll << strJSTail;
	Utils::CallJS(streamAll);
	streamAll.clear();
	streamAll.str("");
}

void ChatListener::onFileMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMFileMessageBodyPtr body = std::dynamic_pointer_cast<EMFileMessageBody, EMMessageBody>(_body);

	string strJSHead = getJSHead(msg, sChatType,"onFileMessage");
	string strJSTail = getJSTail(_body, "file");

	CallJSWithoutFilePath(strJSHead, strJSTail);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus())
		{
			CallJSWithFilePath(strJSHead, strJSTail, GetPathForWebPage(body->localPath()));
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

	string strJSHead = getJSHead(msg, sChatType,"onPictureMessage");
	string strJSTail = getJSTail(_body, "img");

	CallJSWithoutFilePath(strJSHead, strJSTail);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus() && EMFileMessageBody::SUCCESSED == body->thumbnailDownloadStatus())
		{
			CallJSWithFilePath(strJSHead, strJSTail, GetPathForWebPage(body->localPath()));
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

	string strJSHead = getJSHead(msg, sChatType,"onAudioMessage");
	string strJSTail = getJSTail(_body, "audio");

	CallJSWithoutFilePath(strJSHead, strJSTail);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus())
		{
			CallJSWithFilePath(strJSHead, strJSTail, GetPathForWebPage(body->localPath()));
		}
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return true;
	},
		[](int){}));
	if (EMFileMessageBody::SUCCESSED == body->downloadStatus())
	{
		CallJSWithFilePath(strJSHead, strJSTail, GetPathForWebPage(body->localPath()));
	}
	else
	{
		msg->setCallback(msgCallback);
	}
}

void ChatListener::onVideoMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType)
{
	EMVideoMessageBodyPtr body = std::dynamic_pointer_cast<EMVideoMessageBody, EMMessageBody>(_body);

	string strJSHead = getJSHead(msg, sChatType,"onVideoMessage");
	string strJSTail = getJSTail(_body, "video");

	CallJSWithoutFilePath(strJSHead, strJSTail);

	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		if (EMFileMessageBody::SUCCESSED == body->downloadStatus() && EMFileMessageBody::SUCCESSED == body->thumbnailDownloadStatus())
		{
			CallJSWithFilePath(strJSHead, strJSTail, GetPathForWebPage(body->localPath()));
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
