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
#ifndef EMCORE_CONNECTIONMANAGER_H
#define EMCORE_CONNECTIONMANAGER_H


#include "emconnectionlistener.h"
#include "emconnection.h"
#include <emloghandler.h>
#include <emlogsink.h>

#include <memory>
#include <set>
#include <mutex>
#include "emtaskqueue.h"
#include "emsemaphoretracker.h"
#include "emmanager_base.h"
#include "utils/emlog.h"
#include "utils/emtimer.h"
#include "emerror.h"
#include "emnetworklistener.h"
#include "chatclient.hpp"
#include "emdnsmanager.h"

namespace easemob {

class EMLog;
class EMContact;
class EMConfigManager;
class EMSessionManagerListener;
class EMConnectionListener;


/*
  connection manager will handle register, login, logout
  and all connection related : reconnect, heart beat, dns config etc.
 */

class EMSessionManager: public  protocol::ConnectionListener, protocol::LogHandler, public EMManagerBase {
public:
    enum class EMConnectState { DISCONNECTED, CONNECTING, CONNECTED };
    enum class EMLoginState { LOGOUT, LOGINING, LOGIN };
    
    EMSessionManager(std::shared_ptr<EMConfigManager> config_manager);
    virtual ~EMSessionManager();

    bool isConnected() { return connectState() == EMConnectState::CONNECTED; }
    bool isLoggedIn() { return loginState() == EMLoginState::LOGIN; }
    EMLoginState loginState();

    EMErrorPtr login(const std::string &username, const std::string &password);
    // auto login will keep trying till user logout(on another device) or user removed
    EMErrorPtr autoLogin(const std::string &username, const std::string &password);
    void logout();
    EMErrorPtr createAccount(const std::string &username, const std::string &password);
    void sendPing();
    bool sendPing(bool waitPong, long timeout);

    void addConnectionListener(EMConnectionListener* cl);
    void removeConnectionListener(EMConnectionListener *cl);

    std::unique_ptr<protocol::ChatClient>& getChatClient() {return mChatClient;}
    EMTaskQueueThreadPtr getCallbackThread() { return mCallbackThread; }

    void setPresence(long chatLoginTime);

    // ConnectionListener functions
    virtual void onConnect();
    virtual void onDisconnect(protocol::ConnectionError e);
    virtual bool onTLSConnect(const protocol::CertInfo &info);
    virtual void onPong();
    virtual void onRedirect(const std::string& host, int port);
    // LogHandler function
    virtual void handleLog(protocol::LogLevel level, protocol::LogArea area, const std::string &message);
    
    virtual void onNetworkChanged(EMNetworkListener::EMNetworkType to);
    EMNetworkListener::EMNetworkType networkType();
    
    void reconnect();
    void disconnect();
    void reconnect(const EMDNSManager::EMHost&);
    void clearTasksBeforeDestroy();
    
    virtual void onInit();
    virtual void onDestroy();
private:
    void startReceive(bool start = false);
    void stopReceive();
    int  getDelayedTime();

    inline bool isUserNameValid(const std::string &username) const;
    inline bool isPasswordValid(const std::string &password) const;
    inline bool isAppKeyValid(const std::string &appkey) const;
    
    EMConnectState connectState();
    void doConnect();
    void doDisconnect();
    EMErrorPtr login(const std::string &username, const std::string &password, bool autoLogin);
    void scheduleReconnect(bool updateServer, bool updateToken);
    void cancelReconnectschedule();
    void doReconnect(bool updateToken);
    void delayReconnect(const std::function<void(EMTimer::Result)> &callback);
    void notifyStateChange(EMError::EMErrorCode);
    
    std::unique_ptr<protocol::ChatClient> mChatClient;
    EMSet<EMConnectionListener*> mConnectionListeners;
    std::shared_ptr<EMConfigManager> mConfigManager;

    EMTimer *mTimer;
    int mAttempts;
    EMSemaphoreTrackerPtr mLoginSemaphore;
    bool mRunning;
    
    EMConnectState mConnectState;
    std::recursive_mutex mConnectMutex;
    EMLoginState mLoginState;
    std::recursive_mutex mLoginMutex;
    std::string mLoginUser;
    std::recursive_mutex mOperateMutex;
    
    EMSemaphoreTrackerPtr mTracker;
    EMTaskQueueThreadPtr mCallbackThread;
    EMTaskQueuePtr mTaskQueue;
    std::recursive_mutex mQueueMutex;
    long mImLoginTime;
    EMNetworkListener::EMNetworkType mNetworkType;
    EMSemaphoreTrackerPtr mPingTracker;
};


} //namespace easemob

#endif
