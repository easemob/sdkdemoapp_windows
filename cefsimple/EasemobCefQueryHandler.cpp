#include "EasemobCefQueryHandler.h"
#include "commdlg.h"
#include "atlstr.h"
#include <ShlObj.h>
#include "resource.h"

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

string getStringAttrFromJson(Json::Value& json, string attr)
{
	string ret;
	Json::Value defaultValue;
	if (json.get(attr, defaultValue).isString())
	{
		ret = json.get(attr, defaultValue).asString();
	}
	return ret;
}

std::vector<std::string> getArrayAttrFromJson(Json::Value& json, string attr)
{
	std::vector<std::string> ret;
	Json::Value defaultValue;
	if (json.get(attr, defaultValue).isArray())
	{
		Json::Value arr = json.get(attr, defaultValue);
		for (Json::Value member : arr)
		{
			ret.push_back(member.asString());
		}
	}
	return ret;
}

void EasemobCefQueryHandler::InitSDKFunctionMap()
{
	m_mapSDKCall["login"] = &EasemobCefQueryHandler::Login;
	m_mapSDKCall["createAccount"] = &EasemobCefQueryHandler::createAccount;
	m_mapSDKCall["logout"] = &EasemobCefQueryHandler::Logout;
	m_mapSDKCall["getRoster"] = &EasemobCefQueryHandler::getRoster;
	m_mapSDKCall["getGroup"] = &EasemobCefQueryHandler::getGroup;
	m_mapSDKCall["createGroup"] = &EasemobCefQueryHandler::createGroup;
	m_mapSDKCall["addGroupMembers"] = &EasemobCefQueryHandler::addGroupMembers;
	m_mapSDKCall["removeGroupMembers"] = &EasemobCefQueryHandler::removeGroupMembers;
	m_mapSDKCall["changeGroupSubject"] = &EasemobCefQueryHandler::changeGroupSubject;
	m_mapSDKCall["changeGroupDescription"] = &EasemobCefQueryHandler::changeGroupDescription;
	m_mapSDKCall["acceptJoinGroupApplication"] = &EasemobCefQueryHandler::acceptJoinGroupApplication;
	m_mapSDKCall["declineJoinGroupApplication"] = &EasemobCefQueryHandler::declineJoinGroupApplication;
	m_mapSDKCall["acceptInvitationFromGroup"] = &EasemobCefQueryHandler::acceptInvitationFromGroup;
	m_mapSDKCall["declineInvitationFromGroup"] = &EasemobCefQueryHandler::declineInvitationFromGroup;
	m_mapSDKCall["getChatroom"] = &EasemobCefQueryHandler::getChatroom;
	m_mapSDKCall["joinChatroom"] = &EasemobCefQueryHandler::joinChatroom;
	m_mapSDKCall["quitChatroom"] = &EasemobCefQueryHandler::quitChatroom;
	m_mapSDKCall["groupMembers"] = &EasemobCefQueryHandler::groupMembers;
	m_mapSDKCall["groupOwner"] = &EasemobCefQueryHandler::groupOwner;
	m_mapSDKCall["groupStyle"] = &EasemobCefQueryHandler::groupStyle;
	m_mapSDKCall["leaveGroup"] = &EasemobCefQueryHandler::leaveGroup;
	m_mapSDKCall["destroyGroup"] = &EasemobCefQueryHandler::destroyGroup;
	m_mapSDKCall["joinPublicGroup"] = &EasemobCefQueryHandler::joinPublicGroup;
	m_mapSDKCall["applyJoinPublicGroup"] = &EasemobCefQueryHandler::applyJoinPublicGroup;
	m_mapSDKCall["addFriend"] = &EasemobCefQueryHandler::addFriend;
	m_mapSDKCall["delFriend"] = &EasemobCefQueryHandler::delFriend;
	m_mapSDKCall["acceptInvitation"] = &EasemobCefQueryHandler::acceptInvitation;
	m_mapSDKCall["declineInvitation"] = &EasemobCefQueryHandler::declineInvitation;
	m_mapSDKCall["sendMessage"] = &EasemobCefQueryHandler::sendMessage;
	m_mapSDKCall["sendFileMessage"] = &EasemobCefQueryHandler::sendFileMessage;

	m_mapSDKCallInWorkThread["groupMembers"] = true;
	m_mapSDKCallInWorkThread["createGroup"] = true;
	m_mapSDKCallInWorkThread["addFriend"] = true;
	m_mapSDKCallInWorkThread["delFriend"] = true;
	m_mapSDKCallInWorkThread["changeGroupSubject"] = true;
	m_mapSDKCallInWorkThread["changeGroupDescription"] = true;
	m_mapSDKCallInWorkThread["addGroupMembers"] = true;
	m_mapSDKCallInWorkThread["removeGroupMembers"] = true;
}

EasemobCefQueryHandler::EasemobCefQueryHandler()
{
	CreateEMClient();
	InitSDKFunctionMap();
}
#include <thread>
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
		string type = getStringAttrFromJson(json, "type");
		if (!type.empty())
		{
			if (m_mapSDKCall[type] != nullptr)
			{
				if (m_mapSDKCallInWorkThread[type])
				{
					std::thread t = thread([=]{
						(this->*m_mapSDKCall[type])(json, callback);
					});
					t.detach();
				}
				else
				{
					(this->*m_mapSDKCall[type])(json, callback);
				}
			}
			return true;
		}
	}
	return false;
}

void EasemobCefQueryHandler::CreateEMClient()
{
	CString strAppDir = GetAppDataPath() + L"\\EasemobDemo";
	CefString sAppDir(strAppDir);
	CreateDirectory(strAppDir, NULL);
	easemob::EMChatConfigsPtr configs(new easemob::EMChatConfigs(sAppDir, sAppDir, "easemob-demo#chatdemoui"));
	configs->setOs(EMChatConfigs::OS_MSWIN);
	configs->setEnableConsoleLog(true);
	configs->setAutoAcceptGroup(false);
	configs->setClientResource("windows");
	configs->setLogLevel(EMChatConfigs::DEBUG_LEVEL);
	EMClient *client = EMClient::create(configs);
	g_client = client;

	mChatListener = new ChatListener();
	g_client->getChatManager().addListener(mChatListener);
	mContactListener = new ContactListener();
	g_client->getContactManager().registerContactListener(mContactListener);
	mConnectionListener = new ConnectionListener();
	g_client->addConnectionListener(mConnectionListener);
	mGroupManagerListener = new GroupManagerListener();
	g_client->getGroupManager().addListener(mGroupManagerListener);
}

EasemobCefQueryHandler::~EasemobCefQueryHandler()
{
	g_client->getChatManager().removeListener(mChatListener);
	g_client->getContactManager().removeContactListener(mContactListener);
	g_client->removeConnectionListener(mConnectionListener);
	g_client->getGroupManager().removeListener(mGroupManagerListener);
	g_client->logout();

	delete mConnectionListener;
	delete mContactListener;
	delete mChatListener;
	delete mGroupManagerListener;
	delete g_client;
}

void EasemobCefQueryHandler::Login(Json::Value json, CefRefPtr<Callback> callback)
{
	string id = getStringAttrFromJson(json, "id");
	string password = getStringAttrFromJson(json, "password");
	if (!id.empty() && !password.empty())
	{
		EMErrorPtr error = g_client->login(id, password);
		if (error->mErrorCode == EMError::EM_NO_ERROR)
		{
			callback->Success("Login Ok");
			EMError error;
			std::vector<std::string> mContacts;
			mContacts = g_client->getContactManager().allContacts(error);
			if (error.mErrorCode == EMError::EM_NO_ERROR)
			{
				string ret;
				for (string username : mContacts)
				{
					ret += "{\"subscription\":\"both\",\"name\":\"";
					ret += username;
					ret += "\"},";
				}
				if (!ret.empty())
				{
					string tmp = ret.substr(0, ret.length() - 1);
					ret = "Demo.conn._onUpdateMyRoster('[" + tmp + "]')";
				}
				std::stringstream stream;
				stream << ret;
				Utils::CallJS(stream);
				SetEvent(Utils::g_RosterDownloaded);
			}

			EMGroupList groupList = g_client->getGroupManager().allMyGroups(error);
			if (error.mErrorCode == EMError::EM_NO_ERROR)
			{
				string ret;
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
					ret = "Demo.conn._onUpdateMyGroupList('[" + tmp + "]')";
				}
				std::stringstream stream;
				stream << ret;
				Utils::CallJS(stream);
				SetEvent(Utils::g_GroupListDownloaded);
			}
		}
		else
		{
			callback->Failure(error->mErrorCode, error->mDescription);
		}
	}
}

void EasemobCefQueryHandler::createAccount(Json::Value json, CefRefPtr<Callback> callback)
{
	string id = getStringAttrFromJson(json, "id");
	string password = getStringAttrFromJson(json, "password");
	if (!id.empty() && !password.empty())
	{
		EMErrorPtr error = g_client->createAccount(id, password);
		if (error->mErrorCode == EMError::EM_NO_ERROR)
		{
			callback->Success("Sign up Ok");
		}
		else
		{
			callback->Failure(error->mErrorCode, error->mDescription);
		}
	}
}

void EasemobCefQueryHandler::Logout(Json::Value json, CefRefPtr<Callback> callback)
{
	g_client->logout();
	callback->Success("Logout Ok");
}

void EasemobCefQueryHandler::getRoster(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	std::vector<std::string> mContacts;
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
		SetEvent(Utils::g_RosterDownloaded);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::getGroup(Json::Value json, CefRefPtr<Callback> callback)
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
		string enc = Utils::URLEncode(ret);

		callback->Success(ret);
		SetEvent(Utils::g_GroupListDownloaded);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::createGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string subject = getStringAttrFromJson(json, "subject");
	string description = getStringAttrFromJson(json, "description");
	string welcomeMessage = getStringAttrFromJson(json, "welcomeMessage");
	string style = getStringAttrFromJson(json, "style");
	string maxUserCount = getStringAttrFromJson(json, "maxUserCount");
	stringstream stream;
	stream << maxUserCount;
	int nMaxUserCount;
	stream >> nMaxUserCount;
	EMGroupSetting setting;
	EMGroupSetting::EMGroupStyle emGroupStyle = EMGroupSetting::EMGroupStyle::PRIVATE_OWNER_INVITE;
	if (style.compare("PRIVATE_MEMBER_INVITE") == 0)
	{
		emGroupStyle = EMGroupSetting::EMGroupStyle::PRIVATE_MEMBER_INVITE;
	}
	else if (style.compare("PUBLIC_JOIN_APPROVAL") == 0)
	{
		emGroupStyle = EMGroupSetting::EMGroupStyle::PUBLIC_JOIN_APPROVAL;
	}
	else if (style.compare("PUBLIC_JOIN_OPEN") == 0)
	{
		emGroupStyle = EMGroupSetting::EMGroupStyle::PUBLIC_JOIN_OPEN;
	}
	setting.setStyle(emGroupStyle);
	setting.setMaxUserCount(nMaxUserCount);
	EMGroupMemberList members = getArrayAttrFromJson(json, "members");
	EMGroupPtr group = g_client->getGroupManager().createGroup(subject, description, welcomeMessage, setting, members, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		ret = "{\"id\":\"" + group->groupId()
			+ "\",\"subject\":\"" + group->groupSubject() + "\"}";
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::addGroupMembers(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string welcomeMessage = getStringAttrFromJson(json, "welcomeMessage");
	EMGroupMemberList members = getArrayAttrFromJson(json, "members");
	EMGroupPtr group = g_client->getGroupManager().addGroupMembers(id, members, welcomeMessage, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		ret = "{\"id\":\"" + group->groupId()
			+ "\",\"subject\":\"" + group->groupSubject() + "\"}";
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::removeGroupMembers(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	EMGroupMemberList members = getArrayAttrFromJson(json, "members");
	EMGroupPtr group = g_client->getGroupManager().removeGroupMembers(id, members, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		ret = "{\"id\":\"" + group->groupId()
			+ "\",\"subject\":\"" + group->groupSubject() + "\"}";
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::changeGroupSubject(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string subject = getStringAttrFromJson(json, "subject");
	EMGroupPtr group = g_client->getGroupManager().changeGroupSubject(id, subject, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		ret = "{\"id\":\"" + group->groupId()
			+ "\",\"subject\":\"" + group->groupSubject() + "\"}";
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::changeGroupDescription(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string description = getStringAttrFromJson(json, "description");
	EMGroupPtr group = g_client->getGroupManager().changeGroupDescription(id, description, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		ret = "{\"id\":\"" + group->groupId()
			+ "\",\"description\":\"" + group->groupDescription() + "\"}";
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::acceptJoinGroupApplication(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string user = getStringAttrFromJson(json, "user");
	EMGroupPtr group = g_client->getGroupManager().acceptJoinGroupApplication(id, user, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::declineJoinGroupApplication(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string user = getStringAttrFromJson(json, "user");
	string reason = getStringAttrFromJson(json, "reason");
	EMGroupPtr group = g_client->getGroupManager().declineJoinGroupApplication(id, user, reason, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::acceptInvitationFromGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string user = getStringAttrFromJson(json, "user");
	EMGroupPtr group = g_client->getGroupManager().acceptInvitationFromGroup(id, user, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::declineInvitationFromGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string user = getStringAttrFromJson(json, "user");
	string reason = getStringAttrFromJson(json, "reason");
	g_client->getGroupManager().declineInvitationFromGroup(id, user, reason, error);
	string ret;
	if (error.mErrorCode == EMError::EM_NO_ERROR)
	{
		callback->Success(ret);
	}
	else
	{
		callback->Failure(error.mErrorCode, error.mDescription);
	}
}

void EasemobCefQueryHandler::getChatroom(Json::Value json, CefRefPtr<Callback> callback)
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

void EasemobCefQueryHandler::joinChatroom(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		g_client->getChatroomManager().joinChatroom(id, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(id);
		}

	}
}

void EasemobCefQueryHandler::quitChatroom(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		g_client->getChatroomManager().leaveChatroom(id, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(id);
		}
	}
}

void EasemobCefQueryHandler::groupMembers(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		string ret;
		const EMGroupMemberList *gml = g_client->getGroupManager().fetchGroupSpecification(id, error)->groupMembers();
		if (gml == NULL)
		{
			return;
		}
		for (string member : *gml)
		{
			ret += "{\"jid\":\"";
			ret += member;
			ret += "\",\"affiliation\":\"";
			ret += "member";
			ret += "\"},";
		}
		if (!ret.empty())
		{
			string tmp = ret.substr(0, ret.length() - 1);
			ret = "[" + tmp + "]";
		}
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(ret);
		}
	}
}

void EasemobCefQueryHandler::groupOwner(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		string ret = g_client->getGroupManager().fetchGroupSpecification(id, error)->groupOwner();
		const EMGroupSetting *setting = g_client->getGroupManager().fetchGroupSpecification(id, error)->groupSetting();
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(ret);
		}
	}
}

void EasemobCefQueryHandler::groupStyle(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		const EMGroupSetting *setting = g_client->getGroupManager().fetchGroupSpecification(id, error)->groupSetting();
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			string ret = "PRIVATE_MEMBER_INVITE";
			switch (setting->style())
			{
			case EMGroupSetting::PRIVATE_MEMBER_INVITE:
				ret = "PRIVATE_MEMBER_INVITE";
				break;
			case EMGroupSetting::PRIVATE_OWNER_INVITE:
				ret = "PRIVATE_OWNER_INVITE";
				break;
			case EMGroupSetting::PUBLIC_JOIN_OPEN:
				ret = "PUBLIC_JOIN_OPEN";
				break;
			case EMGroupSetting::PUBLIC_JOIN_APPROVAL:
				ret = "PUBLIC_JOIN_APPROVAL";
				break;
			default:
				break;
			}
			callback->Success(ret);
		}
	}
}

void EasemobCefQueryHandler::leaveGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		g_client->getGroupManager().leaveGroup(id, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(id);
		}
	}
}

void EasemobCefQueryHandler::destroyGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		g_client->getGroupManager().destroyGroup(id, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(id);
		}
	}
}

void EasemobCefQueryHandler::joinPublicGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	if (!id.empty())
	{
		const EMGroupPtr group = g_client->getGroupManager().joinPublicGroup(id, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(group->groupId());
		}
	}
}

void EasemobCefQueryHandler::applyJoinPublicGroup(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string id = getStringAttrFromJson(json, "id");
	string nickname = getStringAttrFromJson(json, "nickname");
	string message = getStringAttrFromJson(json, "message");
	if (!id.empty() && !nickname.empty() && !message.empty())
	{
		const EMGroupPtr group = g_client->getGroupManager().applyJoinPublicGroup(id, nickname, message, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(group->groupId());
		}
	}
}

void EasemobCefQueryHandler::addFriend(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string to = getStringAttrFromJson(json, "to");
	string message = getStringAttrFromJson(json, "message");
	if (!to.empty())
	{
		g_client->getContactManager().inviteContact(to, message, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(to);
		}
	}
}

void EasemobCefQueryHandler::delFriend(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string to = getStringAttrFromJson(json, "to");
	if (!to.empty())
	{
		g_client->getContactManager().deleteContact(to, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(to);
		}
	}
}

void EasemobCefQueryHandler::acceptInvitation(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string to = getStringAttrFromJson(json, "to");
	if (!to.empty())
	{
		g_client->getContactManager().acceptInvitation(to, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(to);
		}
	}
}

void EasemobCefQueryHandler::declineInvitation(Json::Value json, CefRefPtr<Callback> callback)
{
	EMError error;
	string to = getStringAttrFromJson(json, "to");
	if (!to.empty())
	{
		g_client->getContactManager().declineInvitation(to, error);
		if (error.mErrorCode != EMError::EM_NO_ERROR)
		{
			callback->Failure(error.mErrorCode, error.mDescription);
		}
		else
		{
			callback->Success(to);
		}
	}
}

void EasemobCefQueryHandler::sendMessage(Json::Value json, CefRefPtr<Callback> callback)
{
	string to = getStringAttrFromJson(json, "to");
	string content = getStringAttrFromJson(json, "msg");
	content = Utils::URLDecode(content);
	string chatType = getStringAttrFromJson(json, "chatType");

	EMMessageBodyPtr body = EMTextMessageBodyPtr(new EMTextMessageBody(content.c_str()));

	CefStringUTF8 utf8(content);

	EMMessage::EMChatType type = EMMessage::SINGLE;
	if (chatType.compare("chatRoom") == 0)
	{
		type = EMMessage::CHATROOM;
	}
	else if(chatType.compare("groupChat") == 0)
	{
		type = EMMessage::GROUP;
	}

	EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), to,
		body, type);
	EMCallbackPtr msgCallback(new EMCallback(m_coh,
		[=](void)->bool
	{
		string enc = Utils::URLEncode(utf8);
		callback->Success(enc.c_str());
		return true;
	},
		[=](const easemob::EMErrorPtr error)->bool
	{
		callback->Failure(error->mErrorCode, error->mDescription);
		return false;
	},
		[](int){}));

	msg->setCallback(msgCallback);

	g_client->getChatManager().sendMessage(msg);
}

void EasemobCefQueryHandler::sendFileMessage(Json::Value json, CefRefPtr<Callback> callback)
{
	string to = getStringAttrFromJson(json, "to");
	string content = getStringAttrFromJson(json, "msg");
	string sChatType = getStringAttrFromJson(json, "chatType");
	string type = getStringAttrFromJson(json, "message_type");

	OPENFILENAME ofn;       // common dialog box structure
	TCHAR szFile[260];       // buffer for file name

	ZeroMemory(&ofn, sizeof(ofn));
	ofn.lStructSize = sizeof(ofn);
	ofn.hwndOwner = ::GetDesktopWindow();
	ofn.lpstrFile = szFile;
	ofn.lpstrFile[0] = '\0';
	ofn.nMaxFile = sizeof(szFile);
	const int FILTER_LENGTH = 500;
	TCHAR szFilter[FILTER_LENGTH] = {0};
	LoadString(NULL, IDS_ALL_FILES, szFilter, FILTER_LENGTH);
	ofn.lpstrFilter = szFilter;
	if (type.compare("img") == 0)
	{
		memset(szFilter, 0, FILTER_LENGTH);
		LoadString(NULL, IDS_IMG_FILES, szFilter, FILTER_LENGTH);
		ofn.lpstrFilter = szFilter;
	}
	else if (type.compare("aud") == 0)
	{
		memset(szFilter, 0, FILTER_LENGTH);
		LoadString(NULL, IDS_AUD_FILES, szFilter, FILTER_LENGTH);
		ofn.lpstrFilter = szFilter;
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
		if (sChatType.compare("chatRoom") == 0)
		{
			chatType = EMMessage::CHATROOM;
		}
		else if (sChatType.compare("groupChat") == 0)
		{
			chatType = EMMessage::GROUP;
		}

		EMMessagePtr msg = EMMessage::createSendMessage(g_client->getLoginInfo().loginUser(), to,
			body, chatType);

		EMCallbackPtr msgCallback(new EMCallback(m_coh,
			[=](void)->bool
		{
			string enc = Utils::URLEncode(utf8);
			callback->Success(enc.c_str());
			return true;
		},
			[=](const easemob::EMErrorPtr error)->bool
		{
			callback->Failure(error->mErrorCode, error->mDescription);
			return false;
		},
			[](int){}));

		msg->setCallback(msgCallback);

		g_client->getChatManager().sendMessage(msg);
	}
}
