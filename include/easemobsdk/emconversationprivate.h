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
//  emconversationprivate.h
//  easemob
//
//  Created by Neil Cao on 15/7/13.
//
//

#ifndef __easemob__emconversationprivate__
#define __easemob__emconversationprivate__

#include "emconversation.h"
#include "emdatabase.h"

#include <mutex>

namespace easemob
{

class EMDatabase;
class EMConversationPrivate
{
public:
    EMConversationPrivate(const std::string&, EMConversation::EMConversationType, const std::string& ext = "");
    virtual ~EMConversationPrivate();
    void setDatabase(const EMDatabasePtr);
    
    const std::string& conversationId();
    EMConversation::EMConversationType conversationType ();
    
    bool removeMessage(const std::string &msgId);
    bool removeMessage(const EMMessagePtr msg);
    bool insertMessage(const EMMessagePtr msg);
    bool appendMessage(const EMMessagePtr msg);
    bool updateMessage(const EMMessagePtr msg);
    bool clearAllMessages();
    
    bool markMessageAsRead(const std::string &msgId, bool isRead = true);
    bool markAllMessagesAsRead(bool isRead = true);
    bool markMessageAsReadAcked(const EMMessagePtr msg);
    bool markMessageAsDeliveryAcked(const EMMessagePtr msg);
    bool updateMessageBody(const EMMessagePtr msg);
    bool updateMessageStatus(const EMMessagePtr msg, EMMessage::EMMessageStatus status);
    
    int unreadMessagesCount();
    int messagesCount();
    
    EMMessagePtr loadMessage(const std::string &msgId);
    EMMessagePtr latestMessage();
    EMMessagePtr latestMessageFromOthers();
    EMMessageList loadMoreMessages(const std::string &refMsgId, int count, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreMessages(int64_t timeStamp, int count, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreMessages(int64_t timeStamp, EMMessageBody::EMMessageBodyType type, int count, const std::string &from, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreMessages(int64_t timeStamp, const std::string& keywords, int count, const std::string &from, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreMessages(int64_t startTimeStamp, int64_t endTimeStamp, int maxCount);
    
    const std::string& extField();
    bool setExtField(const std::string &ext);
    
    friend EMDatabase;
private:
    std::recursive_mutex mMutex;
    std::string mConversationId;
    EMConversation::EMConversationType mConversationType;
    EMMessagePtr mLatestMessage;
    int mMessagesCount;
    int mUnreadMessagesCount;
    std::string mExtField;
    //record unread message count that migration from Android.
    int mMigrationUnreadCount;
    EMDatabasePtr mDatabase;
};

}

#endif /* defined(__easemob__conversationprivate__) */
