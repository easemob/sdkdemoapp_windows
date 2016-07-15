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
//
//  EMChatManager.h
//  easemob
//
//  Created by Neil Cao on 15/7/2.
//
//

#ifndef __easemob__EMChatManager__
#define __easemob__EMChatManager__

#include "emchatmanager_interface.h"
#include "emchatmanager_listener.h"
#include "emtaskqueue.h"
#include "emsemaphoretracker.h"
#include "message/emfilemessagebody.h"
#include "emconversation_manager.h"
#include "emdatabase.h"
#include "emconfigmanager.h"
#include "emmanager_base.h"
#include "emsessionmanager.h"
#include "emgroupmanager_listener.h"
#include "emchatroom.h"
#include "chatclient.hpp"
#include "chathandler.hpp"
#include "synctrackhandler.hpp"
#include "emconnection_listener.h"
#include "emgroupmanager.h"

#include <vector>
#include <memory>
#include <map>
#include <tuple>

namespace easemob
{

class EMChatManager : public EMChatManagerInterface, public EMConversationManagerListener, public EMManagerBase, public EMGroupManagerListener, public protocol::ChatHandler, public protocol::SyncTrackHandler, public EMConnectionListener
{
public:

    enum AckType
    {READ, DELIVERY};

    EMChatManager(const std::shared_ptr<EMConfigManager>, const std::shared_ptr<EMSessionManager>, const EMDatabasePtr);
    virtual ~EMChatManager();
    void setGroupManager(EMGroupManager*);
    
    virtual void sendMessage(const EMMessagePtr);
    virtual void sendReadAckForMessage(const EMMessagePtr);
    virtual void resendMessage(const EMMessagePtr);
    virtual void downloadMessageThumbnail(const EMMessagePtr);
    virtual void downloadMessageAttachments(const EMMessagePtr);
    
    virtual void addListener(EMChatManagerListener*);
    virtual void removeListener(EMChatManagerListener*);
    virtual void clearListeners();
    
    virtual void removeConversation(const std::string &chatter, bool isRemoveMessages = true);
    virtual EMConversationPtr conversationWithType(const std::string &conversationId, EMConversation::EMConversationType type, bool createIfNotExist = true);
    virtual EMConversationList getConversations();
    virtual EMConversationList loadAllConversationsFromDB();
    virtual void onUpdateConversationList(const EMConversationList &conversations);
    virtual void setEncryptProvider(EMEncryptProviderInterface *provider);
    virtual EMEncryptProviderInterface *getEncryptProvider(bool createIfNotExist = false);
    virtual bool insertMessages(const EMMessageList& list);

    // --- EMManagerBase ---
    virtual void onInit();
    virtual void onDestroy();
    
    //EMGroupManagerListener
    virtual void onUpdateMyGroupList(const std::vector<EMGroupPtr> &list);
    
    void onUpdateMyChatroomList(const std::vector<EMChatroomPtr> &list);

    virtual void handleMessageList(const protocol::MessageList&);
    virtual void handleSync(const protocol::SyncDL&);

    virtual void onConnect();
    virtual void onDisconnect(EMErrorPtr error);
    EMMessagePtr getMessage(const std::string &messageId);
    virtual void uploadLog();

private:
    EMChatManager(const EMChatManager&);
    EMChatManager& operator=(const EMChatManager&);
    
    bool isCommandMessage(const EMMessagePtr) const;
    bool isAutoDownloadMessage(const EMMessagePtr) const;
    bool sendMessageAck(const EMMessagePtr, AckType);
    void asyncSendMessage(const EMMessagePtr);

    void callbackMessageHasReadReceipts(const std::vector<EMMessagePtr>&);
    void callbackMessageDeliveryReceipts(const std::vector<EMMessagePtr>&);
    void callbackReceievedMessages(const std::vector<EMMessagePtr>&);
    void callbackReceievedCmdMessages(const std::vector<EMMessagePtr>&);
    inline void callbackMessageAttachmentsStatusChanged(const EMMessagePtr, const EMErrorPtr);
    inline void callbackMessageStatusChanged(const EMMessagePtr, const EMErrorPtr);
    inline void callbackError(const EMCallbackPtr, const EMMessagePtr, const EMErrorPtr, bool isDownloadStatus = false);
    inline void callbackSuccess(const EMCallbackPtr, const EMMessagePtr, bool isDownloadStatus = false);
    inline void callbackProgress(const EMCallbackPtr, const EMMessagePtr, int percent);
    
    inline void insertMessageToPool(const EMMessagePtr);
    inline void eraseMessageFromPool(const EMMessagePtr);
    inline EMMessagePtr findMessage(const std::string &msgId);
    inline EMConversation::EMConversationType conversationTypeFromMessageChatType(EMMessage::EMChatType chatType);
    inline void insertMessageToConversation(const EMMessagePtr msg, bool createConversation = true);
    inline EMConversationPtr getConversationOfMessage(const EMMessagePtr msg, bool createConversation = true);
    inline void updateMessageId(const EMMessagePtr msg, const std::string &newId);
    inline bool shouldCreateConversationForMessage(const EMMessagePtr msg);
    
    bool uploadAttachments(const EMMessagePtr, bool willRetry, bool& stopRetry);
    bool attachmentLocalPathFromBody(const EMMessageBodyPtr, std::string&, std::string&);
    void downloadAttachments(const EMMessagePtr, bool isThumbnail, bool shouldCallback = true);
    void updateMessageBodyDownloadStatus(const EMMessageBodyPtr, EMFileMessageBody::EMDownloadStatus, bool);
    std::tuple<std::string, std::string, std::string> attachmentDownloadParamFromBody(const EMMessageBodyPtr body, bool);
    void updateMessageLocalPath(const EMMessagePtr msg);
    void translateMessage(const EMMessagePtr from, protocol::Message&, const std::string& domain);
    EMMessagePtr translateMessage(const protocol::Message* from);
    bool isLoginUser(const std::string& user) const;
    bool handleDebugCommand(const EMMessagePtr);
    void uploadLogUUID(const std::string&);
    void uploadDNS();

    EMSet<EMChatManagerListener*> mListeners;
    std::unique_ptr<protocol::ChatClient> &mClient;
    EMSemaphoreTrackerPtr mTracker;
    EMMap<std::string, EMMessagePtr> mMessagePool;
    EMConversationManager *mConversationManager;
    EMGroupManager *mGroupManager;
    std::shared_ptr<EMConfigManager> mConfigManager;
    std::shared_ptr<EMSessionManager> mSessionManager;
    EMMap<std::string, EMGroupPtr> mMyGroups;
    EMMap<std::string, EMChatroomPtr> mMyChatrooms;
    EMDatabasePtr mDatabase;
    std::string mGroupDomain;
    
    EMTaskQueueThreadPtr mCallbackThread;
    EMTaskQueuePtr mDownloadTaskQueue;
    EMTaskQueuePtr mFastTaskQueue;
    EMTaskQueuePtr mSlowTaskQueue;
    EMEncryptProviderInterface *mEncryptProvider;
};

}

#endif /* defined(__easemob__EMChatManager__) */
