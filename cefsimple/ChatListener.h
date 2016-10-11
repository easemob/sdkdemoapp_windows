#pragma once
#include "emchatmanager_listener.h"
#include "atlstr.h"
#include <message/emtextmessagebody.h>
#include <message/emcmdmessagebody.h>
#include <message/emimagemessagebody.h>
#include <message/emfilemessagebody.h>
#include <message/emlocationmessagebody.h>
#include <message/emvideomessagebody.h>
#include <message/emvoicemessagebody.h>
#include <message/emmessagebody.h>
#include <message/emmessage.h>
#include "application.h"
#include <emclient.h>
#include <emchatmanager_interface.h>

using namespace easemob;
using namespace std;

class ChatListener : public EMChatManagerListener {
public:
	ChatListener()
	{
	}

	virtual void onReceiveMessages(const EMMessageList &messages);

private:
	EMCallbackObserverHandle m_coh;
	void onTextMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	void onFileMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	void onImageMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	void onVoiceMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	void onVideoMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	void onLocationMessage(const EMMessagePtr msg, const EMMessageBodyPtr _body, string sChatType);
	string getJSHead(const EMMessagePtr msg, string sChatType, string JSFuncName);
	string getJSTail(const EMMessageBodyPtr _body, string type);
	void CallJSWithoutFilePath(string strJSHead, string strJSTail);
	void CallJSWithFilePath(string strJSHead, string strJSTail, string strPath);
};

