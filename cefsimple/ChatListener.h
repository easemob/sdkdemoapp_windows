#pragma once
#include "emchatmanager_listener.h"
#include "simple_handler.h"
#include <sstream>
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

	void CallJS(const std::stringstream & stream);
	virtual void onReceiveMessages(const EMMessageList &messages);

private:
	EMCallbackObserverHandle m_coh;
};

