#include "EasemobCefQueryHandler.h"
#include "commdlg.h"
#include "atlstr.h"
#include <ShlObj.h>
#include "ChatListener.h"
#include "ContactListener.h"

CString GetAppDataPath()
{
	CString appdata_path;
	wchar_t buffer[MAX_PATH] = { 0 };
	BOOL result = SHGetSpecialFolderPath(NULL, buffer, CSIDL_LOCAL_APPDATA, false);
	if (result)
	{
		appdata_path = buffer;
	}
	return appdata_path;
}

inline BYTE toHex(const BYTE &x)
{
	return x > 9 ? x - 10 + 'A' : x + '0';
}

inline string URLEncode(const string &sIn)
{
	string sOut;
	for (size_t ix = 0; ix < sIn.size(); ix++)
	{
		BYTE buf[4];
		memset(buf, 0, 4);
		if (isalnum((BYTE)sIn[ix]))
		{
			buf[0] = sIn[ix];
		}
		//else if (isspace((BYTE)sIn[ix]))//Character SPACE escape to "%20" rather than "+"
		//{
		//	buf[0] = '+';
		//}
		else
		{
			buf[0] = '%';
			buf[1] = toHex((BYTE)sIn[ix] >> 4);
			buf[2] = toHex((BYTE)sIn[ix] % 16);
		}
		sOut += (char *)buf;
	}
	return sOut;
};


ChatListener *mChatListener;
ContactListener * mContactListener;


EasemobCefQueryHandler::EasemobCefQueryHandler()
{
	CreateEMClient();
}
bool EasemobCefQueryHandler::OnQuery(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	int64 query_id,
	const CefString& request,
	bool persistent,
	CefRefPtr<Callback> callback){
	std::string json_document = request.ToString();

	Json::Value json;
	Json::Reader reader;
	if (reader.parse(json_document, json))
	{
		Json::Value defaultValue;
		if (json.get("type", defaultValue).isString())
		{
			std::string type;
			type = json.get("type", defaultValue).asString();
			if (type == std::string("login"))
			{
				Login(json, callback);
			}
			else if (type == std::string("logout"))
			{
				Logout(json, callback);
			}
			else if (type == std::string("getRoster"))
			{
				getRoster(json, callback);
			}
			else if (type == std::string("getGroup"))
			{
				getGroup(json, callback);
			}
			else if (type == std::string("getChatroom"))
			{
				getChatroom(json, callback);
			}
			else if (type == std::string("joinChatroom"))
			{
				joinChatroom(json, callback);
			}
			else if (type == std::string("quitChatroom"))
			{
				quitChatroom(json, callback);
			}
			else if (type == std::string("addFriend"))
			{
				addFriend(json, callback);
			}
			else if (type == std::string("delFriend"))
			{
				delFriend(json, callback);
			}
			else if (type == std::string("acceptInvitation"))
			{
				acceptInvitation(json, callback);
			}
			else if (type == std::string("declineInvitation"))
			{
				declineInvitation(json, callback);
			}
			else if (type == std::string("sendMessage"))
			{
				sendMessage(json, callback);
			}
			else if (type == std::string("sendFileMessage"))
			{
				sendFileMessage(json, callback);
			}
			return true;
		}
	}
	return false;
}

void EasemobCefQueryHandler::CreateEMClient()
{
	CString strAppDir = GetAppDataPath();
	CefString sAppDir(strAppDir);
	easemob::EMChatConfigsPtr configs(new easemob::EMChatConfigs(sAppDir, sAppDir, "easemob-demo#chatdemoui"));
	configs->setOs(EMChatConfigs::OS_MSWIN);
	configs->setEnableConsoleLog(false);
	EMClient *client = EMClient::create(configs);
	g_client = client;
}

EasemobCefQueryHandler::~EasemobCefQueryHandler()
{
}

void EasemobCefQueryHandler::Login(Json::Value& json, CefRefPtr<Callback> callback)
{
	Json::Value defaultValue;
	if (json.get("id", defaultValue).isString() && json.get("password", defaultValue).isString())
	{
		EMErrorPtr error = g_client->login(json.get("id", defaultValue).asString(), json.get("password", defaultValue).asString());
		if (error->mErrorCode == EMError::EM_NO_ERROR)
		{
			mChatListener = new ChatListener();
			g_client->getChatManager().addListener(mChatListener);
			mContactListener = new ContactListener();
			g_client->getContactManager().registerContactListener(mContactListener);

			callback->Success("Login Ok");
		}
		else
		{
			callback->Failure(error->mErrorCode, "");
		}
	}
}

void EasemobCefQueryHandler::Logout(Json::Value& json, CefRefPtr<Callback> callback)
{
	g_client->logout();
	callback->Success("Logout Ok");
}

void EasemobCefQueryHandler::getRoster(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	std::vector<std::string> mContacts(100);
	mContacts = g_client->getContactManager().getContactsFromServer(error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		for (string username : mContacts)
		{
			ret += "{\"subscription\":\"both\",\"name\":\"";
			ret += username;
			ret += "\"},";
		}
		if (!ret.empty())
		{
			string tmp = ret.substr(0, ret.length() - 1);
			ret = "[" + tmp + "]";
		}
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::getGroup(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	EMGroupList groupList = g_client->getGroupManager().fetchAllMyGroups(error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR) {
		for (EMGroupPtr group : groupList)
		{
			ret += "{\"jid\":\"blahblah\",\"name\":\"";
			ret += group->groupSubject();
			ret += "\",\"roomId\":\"";
			ret += group->groupId();
			ret += "\"},";
		}
		if (!ret.empty())
		{
			string tmp = ret.substr(0, ret.length() - 1);
			ret = "[" + tmp + "]";
		}
		string enc = URLEncode(ret);

		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::getChatroom(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	EMChatroomList roomList = g_client->getChatroomManager().fetchAllChatrooms(error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR) {
		for (EMChatroomPtr room : roomList)
		{
			ret += "{\"owner\":\"";
			ret += room->owner();
			ret += "\",\"name\":\"";
			ret += room->chatroomSubject();
			ret += "\",\"id\":\"";
			ret += room->chatroomId();
			ret += "\",\"affiliations_count\":";
			ret += "5";
			ret += "},";
		}
		if (!ret.empty())
		{
			string tmp = ret.substr(0, ret.length() - 1);
			ret = "[" + tmp + "]";
		}
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::joinChatroom(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("id", defaultValue).isString())
	{
		g_client->getChatroomManager().joinChatroom(json.get("id", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("id", defaultValue).asString());
		}

	}
}

void EasemobCefQueryHandler::quitChatroom(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("id", defaultValue).isString())
	{
		g_client->getChatroomManager().leaveChatroom(json.get("id", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("id", defaultValue).asString());
		}
	}
}

void EasemobCefQueryHandler::addFriend(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString() && json.get("message", defaultValue).isString())
	{
		g_client->getContactManager().inviteContact(json.get("to", defaultValue).asString(), json.get("message", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("to", defaultValue).asString());
		}
	}
}

void EasemobCefQueryHandler::delFriend(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString())
	{
		g_client->getContactManager().deleteContact(json.get("to", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("to", defaultValue).asString());
		}
	}
}

void EasemobCefQueryHandler::acceptInvitation(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString())
	{
		g_client->getContactManager().acceptInvitation(json.get("to", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("to", defaultValue).asString());
		}
	}
}

void EasemobCefQueryHandler::declineInvitation(Json::Value& json, CefRefPtr<Callback> callback)
{
	EMError error;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString())
	{
		g_client->getContactManager().declineInvitation(json.get("to", defaultValue).asString(), error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(json.get("to", defaultValue).asString());
		}
	}
}

void EasemobCefQueryHandler::sendMessage(Json::Value& json, CefRefPtr<Callback> callback)
{
	string to, content, isGoupChat, roomType;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString())
	{
		to = json.get("to", defaultValue).asString();
	}
	if (json.get("msg", defaultValue).isString())
	{
		content = json.get("msg", defaultValue).asString();
	}
	if (json.get("group", defaultValue).isString())
	{
		isGoupChat = json.get("group", defaultValue).asString();
	}
	if (json.get("roomType", defaultValue).isString())
	{
		roomType = json.get("roomType", defaultValue).asString();
	}

	EMMessageBodyPtr body = EMTextMessageBodyPtr(new EMTextMessageBody(content.c_str()));

	CefStringUTF8 utf8(content);

	EMMessage::EMChatType type = EMMessage::SINGLE;
	if (isGoupChat.compare("groupchat") == 0)
	{
		if (roomType.compare("true") == 0)
		{
			type = EMMessage::CHATROOM;
		}
		else
		{
			type = EMMessage::GROUP;
		}
	}

	EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), to,
		body, type);
	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		string enc = URLEncode(utf8);
		callback->Success(enc.c_str());
		return true;
	},
		[=](const easemob::EMErrorPtr)->bool
	{
		return false;
	},
		[](int){}));

	msg->setCallback(msgCallback);

	g_client->getChatManager().sendMessage(msg);
}

void EasemobCefQueryHandler::sendFileMessage(Json::Value& json, CefRefPtr<Callback> callback)
{
	string to, content, isGoupChat, roomType, type;
	Json::Value defaultValue;
	if (json.get("to", defaultValue).isString())
	{
		to = json.get("to", defaultValue).asString();
	}
	if (json.get("group", defaultValue).isString())
	{
		isGoupChat = json.get("group", defaultValue).asString();
	}
	if (json.get("roomType", defaultValue).isString())
	{
		roomType = json.get("roomType", defaultValue).asString();
	}
	if (json.get("message_type", defaultValue).isString())
	{
		type = json.get("message_type", defaultValue).asString();
	}

	OPENFILENAME ofn;       // common dialog box structure
	TCHAR szFile[260];       // buffer for file name

	ZeroMemory(&ofn, sizeof(ofn));
	ofn.lStructSize = sizeof(ofn);
	ofn.hwndOwner = ::GetDesktopWindow();
	ofn.lpstrFile = szFile;
	ofn.lpstrFile[0] = '\0';
	ofn.nMaxFile = sizeof(szFile);
	ofn.lpstrFilter = L"所有文件(*.*)\0*.*\0\0";
	if (type.compare("img") == 0)
	{
		ofn.lpstrFilter = L"图像文件(*.bmp;*.jpg;*.png;*.gif)\0*.bmp;*.jpg;*.png;*.gif\0\0";
	}
	else if (type.compare("aud") == 0)
	{
		ofn.lpstrFilter = L"音频文件(*.mp3;*.amr;*.wmv)\0*.mp3;*.amr;*.wmv\0\0";
	}
	ofn.nFilterIndex = 1;
	ofn.lpstrFileTitle = NULL;
	ofn.nMaxFileTitle = 0;
	ofn.lpstrInitialDir = NULL;
	ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;


	if (GetOpenFileName(&ofn) == TRUE)
	{
		std::wstring sAttach = ofn.lpstrFile;
		CefStringUTF8 utf8(sAttach);


		EMMessageBodyPtr body;
		if (type.compare("aud") == 0)
		{
			body = EMFileMessageBodyPtr(new EMFileMessageBody(utf8.ToString().c_str()));
		}
		else if (type.compare("img") == 0)
		{
			body = EMImageMessageBodyPtr(new EMImageMessageBody(utf8.ToString().c_str(), ""));
		}
		else if (type.compare("file") == 0)
		{
			body = EMFileMessageBodyPtr(new EMFileMessageBody(utf8.ToString().c_str()));
		}

		EMMessage::EMChatType chatType = EMMessage::SINGLE;
		if (isGoupChat.compare("groupchat") == 0)
		{
			if (roomType.compare("true") == 0)
			{
				chatType = EMMessage::CHATROOM;
			}
			else
			{
				chatType = EMMessage::GROUP;
			}
		}
		EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), to,
			body, chatType);

		EMCallbackPtr msgCallback(new EMCallback(m_coh,
			[=](void)->bool
		{
			string enc = URLEncode(utf8);
			callback->Success(enc.c_str());
			return true;
		},
			[=](const easemob::EMErrorPtr)->bool
		{
			return false;
		},
			[](int){}));

		msg->setCallback(msgCallback);

		g_client->getChatManager().sendMessage(msg);
	}
}
