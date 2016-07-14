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
#ifndef EMCORE_CALLMANAGER_H
#define EMCORE_CALLMANAGER_H

#include <set>
#include <string>
#include <vector>
#include <utils/emutils.h>

#include "emmanager_base.h"
#include "emcallmanager_interface.h"
#include "emcallmanager_listener.h"
#include "emnetworklistener.h"
#include "emsessionmanager.h"
#include "emconfigmanager.h"
#include "emicemanager.h"
#include "emerror.h"
#include "emticket.h"
#include "emtaskqueue.h"

#include "calleventhandler.h"
#include "chatclient.hpp"
#include "emcallsession.h"

namespace easemob {

class EMCallManager : public EMManagerBase, public EMCallManagerInterface, public protocol::CallEventHandler, public protocol::SyncTrackHandler
{
public:
    
    EMCallManager(const std::shared_ptr<EMSessionManager>, const std::shared_ptr<EMConfigManager>);
    virtual ~EMCallManager();
    
    //EMManagerBase
    virtual void onDestroy();
    
    //Event Handler
    virtual void handleConference(const protocol::Conference& conference);
    
    //Sync Track Handler
    virtual void handleSync(const protocol::SyncDL&, int context);
    
    //Public api
    virtual EMCallSessionPtr makeCall(const std::string& remoteName, EMCallSession::Type type, EMError& error);
    virtual void answerCall(const std::string& sessionId, EMError& error);
    virtual void endCall(const std::string& sessionId, EMCallSession::EndReason reason);
    virtual bool updateCall(const std::string& sessionId, EMCallSession::StreamControlType controlType);
    virtual std::string getCallTransportId(const std::string& sessionId);
    
    //Listener
    virtual void addListener(EMCallManagerListener*);
    virtual void removeListener(EMCallManagerListener*);
    virtual void clearListeners();
    
    //Network
    std::string networkFromType(EMNetworkListener::EMNetworkType to);
    virtual void onNetworkChanged(EMNetworkListener::EMNetworkType to);

    
private:
    std::recursive_mutex mMutex;
    std::unique_ptr<protocol::ChatClient> &mClient;
    std::shared_ptr<EMSessionManager> mSessionManager;
    std::shared_ptr<EMConfigManager> mConfigManager;
    EMIceManager *mIceManager;
    
    std::recursive_mutex mListenerMutex;
    std::set<EMCallManagerListener*> mListeners;
    
    std::recursive_mutex mSessionMutex;
    EMCallSessionPtr mCurrentSession;
    
    std::recursive_mutex mWaitMutex;
    std::map<std::string, std::string> mWaitIdMap;
    
    EMNetworkListener::EMNetworkType mNetworkType;
    EMTaskQueuePtr mTaskQueue;
    EMTaskQueuePtr mSendTaskQueue;
    EMSemaphoreTrackerPtr mTracker;
    
    //helper
    EMErrorPtr checkBeforeRequest();
    EMErrorPtr checkBeforeRequestWithUsername(const std::string& username);
    bool checkCanCreateNewCall(bool isCaller);
    bool setNegoPairs(std::vector<EMTicketPair*> negoPairs, EMCallSession::ConnectType connectType, EMCallSession::Type callType);
    EMCallSessionPtr stopCall(const std::string& sessionId, bool isIce, bool isSendTerminate, EMCallSession::EndReason reason, int errorCode = EMError::EM_NO_ERROR, bool isBroadcast = true);
    
    //send iq
    std::string getWaitId(const std::string& sessionId, protocol::ConferenceBody::Operation operation);
    void addWaitIdPair(const std::string& key, const std::string& value);
    std::string getWaitIdWithKey(const std::string& key, bool isErase=true);
    void eraseWaitId(const std::string& value);
    void cancelAllWaitSemaphoreForSession(const std::string& sessionId);
    void clearWaitIds();
    bool waitSemaphoreWithId(const std::string& sessionId, const std::string& waitId);
    bool sendJoinRelayIq(EMCallSessionPtr sessionPtr);
    bool sendRemoveRelayIq(const EMCallSessionPtr sessionPtr);
    bool sendSessionInitiate(const EMCallSessionPtr sessionPtr, const std::string& callerContent);
    bool sendAcceptSessionInitiate(const EMCallSessionPtr sessionPtr, const std::string& calleeContent);
    bool sendAcceptSession(const EMCallSessionPtr sessionPtr);
    bool sendTerminateSession(const EMCallSessionPtr sessionPtr, EMCallSession::EndReason reason);
    bool sendTerminateSessionWithId(const std::string& sessionId, const protocol::JID& toJID, EMCallSession::Type type, EMCallSession::EndReason reason, protocol::ConferenceBody::Identity identity, uint64_t duration = 0);
    bool sendUpdateSession(const EMCallSessionPtr sessionPtr, EMCallSession::StreamControlType controlType);
    
    //Receive Handler
    void didReceiveRelayInfoError(const protocol::Conference& conference, int errorCode);
    void didReceiveRelayInfo(const protocol::Conference& conference);
    
    void didReceiveSessionInitiateError(const protocol::Conference& conference, int errorCode);
    void didReceiveSessionInitiate(const protocol::Conference& conference);
    
    void didReceiveAcceptSessionInitiateError(const protocol::Conference& conference, int errorCode);
    void didReceiveAcceptSessionInitiate(const protocol::Conference& conference);
    
    void didReceiveAcceptSessionError(const protocol::Conference& conference, int errorCode);
    void didReceiveAcceptSession(const protocol::Conference& conference);
    
    void didReceiveSessionTerminateError(const protocol::Conference& conference, int errorCode);
    void didReceiveSessionTerminate(const protocol::Conference& conference);
    
    void didReceiveUpdateSessionError(const protocol::Conference& conference, int errorCode);
    void didReceiveUpdateSession(const protocol::Conference& conference);
    
    //broadcast listeners
    void broadcastListenersCallIncoming(const EMCallSessionPtr pSession);
    void broadcastListenersCallConnected(const EMCallSessionPtr pSession);
    void broadcastListenersCallAccepted(const EMCallSessionPtr pSession);
    void broadcastListenersCallTerminated(const EMCallSessionPtr pSession, EMCallSession::EndReason reason, const EMErrorPtr error);
    void broadcastListenersCallUpdated(const EMCallSessionPtr pSession, EMCallSession::StreamControlType controlType);
    void broadcastListenersSetupTransport(const EMCallSessionPtr pSession);
    void broadcastListenersStopTransport(const std::string& stopId);
};

}

#endif
