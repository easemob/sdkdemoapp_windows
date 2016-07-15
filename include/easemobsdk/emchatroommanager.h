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

#ifndef __easemob__emchatroommanager__
#define __easemob__emchatroommanager__

#include "emchatroommanager_interface.h"
#include "emchatroommanager_listener.h"
#include "emmanager_base.h"
#include "emgroupprivate.h"
#include "emconfigmanager.h"
#include "emsessionmanager.h"
#include "emdatabase.h"
#include "emchatmanager_interface.h"
#include "rapidjson/document.h"
#include "emcursorresult.h"
#include "chatclient.hpp"
#include "muceventhandler.h"
#include "emconnection_listener.h"

#include <mutex>
#include "emstl.h"
#include <functional>

namespace easemob
{

typedef std::function<void(const EMChatroomList &chatrooms)> ChatroomListUpdateCallback;

class EMChatroomManager : public EMChatroomManagerInterface, public EMManagerBase, public EMGroupPrivateListener, public protocol::MucEventHandler, public EMConnectionListener
{
public:
    EMChatroomManager(const std::shared_ptr<EMConfigManager>, const std::shared_ptr<EMSessionManager>,  const EMDatabasePtr, EMChatManagerInterface *chatManager);
    virtual ~EMChatroomManager();

    //should leave all chatrooms when login or logoff
    void leaveAllJoinedChatrooms();
    
    //should leave chatrooms which leave failed after reconnect
    void leavePendingChatrooms();
    
    void setChatroomListUpdateCallback(ChatroomListUpdateCallback callback);
    
    //EMManagerBase
    virtual void onInit();
    virtual void onDestroy();

    //EMChatroomManagerInterface
    virtual void addListener(EMChatroomManagerListener* listener);
    virtual void removeListener(EMChatroomManagerListener* listener);
    virtual void clearListeners();
    
    virtual EMChatroomPtr chatroomWithId(const std::string &chatroomId);
    
    virtual EMChatroomList fetchAllChatrooms(
        EMError &error);
    
    virtual EMCursorResult fetchChatroomsWithCursor(
        const std::string &cursor,
        int pageSize,
        EMError &error);
    
    virtual EMChatroomPtr fetchChatroomSpecification(
        const std::string &chatroomId,
        EMError &error,
        bool fetchMembers = false
        );
    
    virtual EMChatroomPtr joinChatroom(
        const std::string &chatroomId,
        EMError &error
        );
    
    virtual EMChatroomPtr leaveChatroom(
        const std::string &chatroomId,
        EMError &error
        );
    
    //EMGroupPrivateListener
    virtual void onLeaveGroup(const EMGroupPrivate* group, int reason);
    virtual std::string loginUser()
    {
        return mConfigManager->loginInfo().mUserName;
    }
    virtual void onMemberJoined(const EMGroupPrivate* group, const std::string &user);
    virtual void onMemberLeft(const EMGroupPrivate* group, const std::string &user);

    //MucEventHandler
    virtual void handleMUCOperation(const protocol::MUCBody&);
    
    virtual void onConnect();
    virtual void onDisconnect(EMErrorPtr);
    virtual EMChatroomPtr joinedChatroomById(const std::string &chatroomId);
private:
    EMChatroomPtr chatroomFromJsonObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &object);
    void insertMyChatroom(const EMChatroomPtr chatroom);
    bool shouldDeleteConversation();
    void removeMyChatroom(const std::string& chatroomId, bool deleteConversation);
    void clearReleasedChatrooms();
    void initChatroom(EMChatroomPtr chatroom);
    EMChatroomPtr joinedChatroom(const EMGroupPrivate*);
    
    void callbackLeaveChatroom(const EMChatroomPtr chatroom, EMChatroom::EMChatroomLeaveReason reason);
    void callbackMemberJoin(const EMChatroomPtr chatroom, const std::string &user);
    void callbackMemberLeave(const EMChatroomPtr chatroom, const std::string &user);
    void callbackMyChatroomListUpdate();
    
    EMSet<EMChatroomManagerListener*> mListeners;
    std::shared_ptr<EMConfigManager> mConfigManager;
    std::shared_ptr<EMSessionManager> mSessionManager;
    std::unique_ptr<protocol::ChatClient> &mClient;
    EMDatabasePtr mDatabase;
    EMChatManagerInterface *mChatManager;
    std::string mDomain;
    std::string mGroupDomain;
    EMMap<std::string, EMChatroomPtr> mMyChatrooms;
    EMMap<std::string, std::weak_ptr<EMChatroom>> mAllChatrooms;
    EMMap<std::string, EMChatroomPtr> mLeavingChatrooms;
    EMMap<std::string, EMChatroomPtr> mOperatingChatrooms;
    ChatroomListUpdateCallback mCallback;
    EMTaskQueueThreadPtr mCallbackThread;
    EMTaskQueueThreadPtr mAsyncThread;
};

}

#endif /* defined(__easemob__emchatroommanager__) */
