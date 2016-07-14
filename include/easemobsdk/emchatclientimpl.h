#ifndef __easemob_emchatclientimpl__
#define __easemob_emchatclientimpl__

#include <string>
#include <memory>
#include <mutex>

#include "emcallback.h"
#include "emchatconfigs.h"
#include "emsessionmanager.h"
#include "emnetworklistener.h"
#include "utils/emhttprequest.h"
#include "emlogcallbackinterface.h"

using std::shared_ptr;
using std::function;


namespace easemob {

// forward declarations
class EMChatManagerInterface;
class EMGroupManagerInterface;
class EMContactManagerInterface;
class EMCallManagerInterface;
class EMDatabase;
class EMConfigManager;
class EMSessionManager;
class EMChatroomManager;
class EMChatroomManagerInterface;
class EMConnectionStateListener;
class EMChatManager;
class EMGroupManager;
class EMContactManager;
class EMCallManager;
class EMLoginInfo;

class EMChatClientImpl {
public:
	EMChatClientImpl();
	virtual ~EMChatClientImpl();
    
    void init(const EMChatConfigsPtr configs);

    virtual EMErrorPtr login(const std::string &username, const std::string &password);
    virtual EMErrorPtr autoLogin(const std::string &username, const std::string &password);
    virtual void logout();
    const EMLoginInfo& getLoginInfo();
    
    virtual void addConnectionListener(EMConnectionListener*);
    virtual void removeConnectionListener(EMConnectionListener*);

    void addLogCallback(EMLogCallbackInterface* aLogCallback);
    void removeLogCallback(EMLogCallbackInterface* aLogCallback);
    
    virtual EMErrorPtr createAccount(const std::string &username, const std::string &password);

    virtual  EMChatConfigsPtr getChatConfigs();
    
    EMChatManagerInterface&    getChatManager();
    EMContactManagerInterface& getContactManager();

    /**
      * \brief Get group manager to manage the group.
      *
      * Note: not release yet, coming soon
      * @param  NA
      * @return group manager instance.
      */
    EMGroupManagerInterface& getGroupManager();
    
    /**
      * \brief Get chatroom manager to manage the chatroom.
      *
      * Note: not release yet, coming soon
      * @param  NA
      * @return Chatroom manager instance.
      */
    EMChatroomManagerInterface& getChatroomManager();

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
    
    std::shared_ptr<EMDatabase> getDatabase() { return mDatabase; }
    
    std::shared_ptr<EMConfigManager> getConfigManager() { return mConfigManager; }
    
    virtual void onNetworkChanged(EMNetworkListener::EMNetworkType to);
    
    int getUserInformation(std::string &response);
    int updateUserInformation(const EMHttpParameters &parameters, std::string &response);
    void bindUserDeviceToken(const std::string& deviceToken, const std::string& certName, EMError& error);
    
    void updateDeviceInformation(const std::string& osVersion, const std::string& model, const std::string& sdkVersion, const std::string& deviceUuid, const std::string& deviceToken, EMError& error);

    bool isConnected();
    bool isLoggedIn();
    void reconnect();
    void disconnect();
    void sendPing();
    bool sendPing(bool waitPong, long timeout);
    EMErrorPtr getUserToken(std::string& token, bool fetchFromServer);
private:
    
    EMSessionManager&       getSessionManager();
    EMChatManager           *mChatManager;
    EMGroupManager          *mGroupManager;
    EMChatroomManager       *mChatroomManager;
    EMContactManager        *mContactManager;
#if ENABLE_CALL
    EMCallManager           *mCallManager;
#endif
    std::shared_ptr<EMSessionManager> mSessionManager;
    std::shared_ptr<EMDatabase> mDatabase;
    std::shared_ptr<EMConfigManager> mConfigManager;
    std::recursive_mutex mMutex;
    //std::set<EMConnectionListenerPtr> mListeners;
};

} //namespace easemob

#endif