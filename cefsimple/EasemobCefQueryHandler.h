#pragma once
#include "include/wrapper/cef_message_router.h"
#include "json/json.h"
#include <emgroupmanager_interface.h>
#include <emchatroommanager_interface.h>
#include <emconversation.h>
#include "application.h"
#include <emclient.h>
#include <emlogininfo.h>
#include "ChatListener.h"
#include "ContactListener.h"
#include "ConnectionListener.h"
#include "GroupManagerListener.h"

using namespace easemob;
using namespace std;

class EasemobCefQueryHandler : public CefMessageRouterBrowserSide::Handler {
public:
	EasemobCefQueryHandler();
	~EasemobCefQueryHandler();

	void InitSDKFunctionMap();
	void CreateEMClient();
	virtual bool OnQuery(CefRefPtr<CefBrowser> browser,
		CefRefPtr<CefFrame> frame,	int64 query_id,
		const CefString& request,bool persistent,
		CefRefPtr<Callback> callback) override;
	void Login(Json::Value json, CefRefPtr<Callback> callback);
	void createAccount(Json::Value json, CefRefPtr<Callback> callback);
	void Logout(Json::Value json, CefRefPtr<Callback> callback);
	void getRoster(Json::Value json, CefRefPtr<Callback> callback);
	void getGroup(Json::Value json, CefRefPtr<Callback> callback);
	void createGroup(Json::Value json, CefRefPtr<Callback> callback);
	void addGroupMembers(Json::Value json, CefRefPtr<Callback> callback);
	void changeGroupSubject(Json::Value json, CefRefPtr<Callback> callback);
	void changeGroupDescription(Json::Value json, CefRefPtr<Callback> callback);
	void acceptJoinGroupApplication(Json::Value json, CefRefPtr<Callback> callback);
	void declineJoinGroupApplication(Json::Value json, CefRefPtr<Callback> callback);
	void acceptInvitationFromGroup(Json::Value json, CefRefPtr<Callback> callback);
	void declineInvitationFromGroup(Json::Value json, CefRefPtr<Callback> callback);
	void removeGroupMembers(Json::Value json, CefRefPtr<Callback> callback);
	void getChatroom(Json::Value json, CefRefPtr<Callback> callback);
	void joinChatroom(Json::Value json, CefRefPtr<Callback> callback);
	void quitChatroom(Json::Value json, CefRefPtr<Callback> callback);
	void groupMembers(Json::Value json, CefRefPtr<Callback> callback);
	void groupOwner(Json::Value json, CefRefPtr<Callback> callback);
	void groupStyle(Json::Value json, CefRefPtr<Callback> callback);
	void leaveGroup(Json::Value json, CefRefPtr<Callback> callback);
	void destroyGroup(Json::Value json, CefRefPtr<Callback> callback);
	void joinPublicGroup(Json::Value json, CefRefPtr<Callback> callback);
	void applyJoinPublicGroup(Json::Value json, CefRefPtr<Callback> callback);
	void addFriend(Json::Value json, CefRefPtr<Callback> callback);
	void delFriend(Json::Value json, CefRefPtr<Callback> callback);
	void acceptInvitation(Json::Value json, CefRefPtr<Callback> callback);
	void declineInvitation(Json::Value json, CefRefPtr<Callback> callback);
	void sendMessage(Json::Value json, CefRefPtr<Callback> callback);
	void sendFileMessage(Json::Value json, CefRefPtr<Callback> callback);

private:
	EMCallbackObserverHandle m_coh;
	typedef void (EasemobCefQueryHandler::*fnSDKCall)(Json::Value, CefRefPtr<Callback>);
	map<string, fnSDKCall> m_mapSDKCall;
	ChatListener *mChatListener;
	ContactListener * mContactListener;
	ConnectionListener *mConnectionListener;
	GroupManagerListener *mGroupManagerListener;
};