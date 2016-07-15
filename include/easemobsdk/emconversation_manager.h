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
//  emconversation_manager.h
//  easemob
//
//  Created by Neil Cao on 15/7/13.
//
//

#ifndef __easemob__emconversation_manager__
#define __easemob__emconversation_manager__

#include "message/emmessage.h"
#include "emconversation.h"
#include "emdatabase.h"
#include "emstl.h"

#include <memory>
#include <mutex>
#include <atomic>

namespace easemob
{

class EMConversationManagerListener
{
public:
    ~EMConversationManagerListener() {}
    virtual void onUpdateConversationList(const EMConversationList &conversations) = 0;
};

class EMConversationManager
{
public:
    EMConversationManager(EMConversationManagerListener *listener, const EMDatabasePtr);
    virtual ~EMConversationManager();
    
    void removeConversation(const std::string &conversationId, bool isRemoveMessages = true);
    EMConversationPtr conversationWithType(const std::string &conversationId, EMConversation::EMConversationType type, bool createIfNotExist = true, bool saveToDbAfterCreate = true);
    EMConversationList loadAllConversationsFromDB();
    EMConversationList getConversations();
    EMMessagePtr loadMessageFromDB(const std::string &msgId);
    void clearCachedConversations();
    void insertMessage(const EMMessagePtr msg);
    void updateMessage(const EMMessagePtr msg);
    void updateMessageId(const std::string& from, const std::string &to);
    
private:
    void callbackUpdateConversationList();
    
    EMConversationManagerListener *mListener;
    EMMap<std::string, EMConversationPtr> mConversations;
    EMDatabasePtr mDatabase;
    std::atomic<bool> mDbLoaded;
};

}

#endif /* defined(__easemob__emconversation_manager__) */
