/************************************************************
 *  * EaseMob CONFIDENTIAL
 * __________________
 * Copyright (C) 2015 EaseMob Technologies. All rights reserved.
 * 
 * NOTICE: All information contained herein is, and remains
 * the property of EaseMob Technologies.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from EaseMob Technologies.
 */
#ifndef EMCORE_CHATCLIENT_H
#define EMCORE_CHATCLIENT_H

#include <string>
#include <map>
#include "emerror.h"
#include "emchatconfigs.h"
#include "emcallback.h"
#include "emnetworklistener.h"
#include "emconnection_listener.h"
#include "emattributevalue.h"
#include "emlogcallbackinterface.h"

namespace easemob {

// forward declarations
class EMChatManagerInterface;
class EMGroupManagerInterface;
class EMContactManagerInterface;
class EMCallManagerInterface;
class EMChatClientImpl;
class EMChatroomManagerInterface;
class EMLoginInfo;
class EMDatabase;
class EMConfigManager;
class EMLogHandlerInterface;
    
/**
 * Enjoy your IM journey! 
 *
 * \section intro_sec Introduction
 * Easemob Linux SDK is an SDK for you to create IM related applications on linux platform.
 *
 * \section integration Integration guide
 * For your fast integration, here is an short guide.
 * 
 * \subsection step1 Step 1: Get chat client
 * Include emchatclient.h and call EMChatClient::create() to get your client, which is the start point of your IM.
 *
 * \subsection step2 Step 2: Register and login
 * Call register() to register a new account. Then you can call login() or logout() to login or logout.
 *
 * \subsection step3 Step 3: Manage your contacts
 * Call getContactManager() to get contact manager to add/remove your contact.
 *
 * \subsection step4 step 4: Let's chat
 * Now you can call getChatManager() to chat with your friends.
 *
 * That's it!
 */
class EASEMOB_API EMChatClient : public EMNetworkListener {
public:
    virtual ~EMChatClient();

    /**
      * \brief Get the chat client with configs.
      *
      * Note: Caller should delete the client when it is not used any more.
      * @param  chat configurations.
      * @return EMChatClient instance.
      */
    static EMChatClient* create(const EMChatConfigsPtr configs);

    /**
      * \brief Login with user name and password.
      *
      * Note: Blocking and time consuming operation.
      * @param:  user name and password
      * @return login result, EMError::EM_NO_ERROR means success, others means fail. @see EMError
      */
    EMErrorPtr login(const std::string &username, const std::string &password);

    /**
     * \brief auto Login with user name and password, sdk will retry automatically if login fail.
     *
     * Note: Blocking and time consuming operation.
     * @param:  user name and password
     * @return login result, EMError::EM_NO_ERROR means success, others means fail. @see EMError
     */
    EMErrorPtr autoLogin(const std::string &username, const std::string &password);

    /**
      * \brief Logout current user.
      *
      * @param  NA
      * @return NA.
      */
    void logout();
    
    /**
      * \brief Get info of current logoin user.
      *
      * @param  NA
      * @return Login info.
      */
    const EMLoginInfo& getLoginInfo();
    
    /**
      * \brief register connection listener.
      *
      * @param  EMConnectionListenerPtr
      * @return NA.
      */
    void addConnectionListener(EMConnectionListener*);
    
    /**
      * \brief remove connection listener.
      *
      * @param  EMConnectionListenerPtr
      * @return NA.
      */
    void removeConnectionListener(EMConnectionListener*);

    
    void addLogCallback(EMLogCallbackInterface* aLogCallback);
    void removeLogCallback(EMLogCallbackInterface* aLogCallback);
    
    
    /**
      * \brief Register a new account with user name and password.
      *
      * Note: Blocking and time consuming operation.
      * @param  user name and password
      * @return register result, EMError::EM_NO_ERROR means success, others means fail.
      */
    EMErrorPtr createAccount(const std::string &username, const std::string &password);
    
    /**
      * \brief Update the chat configs.
      *
      * Note: NA.
      * @param  EMChatConfigPtr
      * @return NA.
      */
    EMChatConfigsPtr getChatConfigs();
    
    /**
      * \brief Get chat manager to handle the message operation.
      *
      * @param  NA
      * @return chat manager instance.
      */
    EMChatManagerInterface&    getChatManager();

    /**
      * \brief Get contact manager to manage the contacts.
      *
      * @param  NA
      * @return contact manager instance.
      */
    EMContactManagerInterface& getContactManager();

    /**
      * \brief Get group manager to manage the group.
      *
      * @param  NA
      * @return group manager instance.
      */
    EMGroupManagerInterface&   getGroupManager();
    
    /**
      * \brief Get chatroom manager to manage the chatroom.
      *
      * @param  NA
      * @return Chatroom manager instance.
      */
    EMChatroomManagerInterface&   getChatroomManager();

    /**
      * \brief Get call manager to handle the voice/video call.
      *
      * Note: not release yet, coming soon
      * @param  NA
      * @return call manager instance.
      */
#if ENABLE_CALL
    EMCallManagerInterface&    getCallManager();
#endif
    
    std::shared_ptr<EMDatabase> getDatabase();
    
    std::shared_ptr<EMConfigManager> getConfigManager(); 


    /**
      * \brief call this method to notify SDK the network change.
      *
      * @param  EMNetworkType
      * @return NA.
      */
    virtual void onNetworkChanged(EMNetworkListener::EMNetworkType to);
    
    //user info
    std::string getUserInformation(EMError& error);
    std::string updateUserInformation(EMError& error, const std::map<std::string, EMAttributeValue> &parameters);
    void bindUserDeviceToken(const std::string& deviceToken, const std::string& certName, EMError& error);
    
    //device info
    void updateDeviceInformation(const std::string& osVersion, const std::string& model, const std::string& sdkVersion, const std::string& deviceUuid, const std::string& deviceToken, EMError& error);

    bool isConnected();
    bool isLoggedIn();
    void reconnect();
    void disconnect();
    void sendPing();
    bool sendPing(bool waitPong, long timeout);
    EMErrorPtr getUserToken(std::string& token, bool fetchFromServer);
private:
    EMChatClient();
    void init(const EMChatConfigsPtr configs);
    EMChatClient(const EMChatClient&);
    EMChatClient& operator=(const EMChatClient&);
    
    EMChatClientImpl *mImpl;
};

}

#endif // EMCORE_CHATCLIENT_H
