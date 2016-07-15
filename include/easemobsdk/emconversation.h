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
//  emconversation.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__emconversation__
#define __easemob__emconversation__

#include <string>
#include <vector>

#include "message/emmessage.h"
#include "embaseobject.h"

namespace easemob
{

class EMConversationPrivate;
class EMConversationManager;
class EMChatManager;
class EMDatabase;

class EASEMOB_API EMConversation : public EMBaseObject
{
public:
    
    /**
     * Conversation type.
     */
    typedef enum {
        CHAT,               //single chat
        GROUPCHAT,          //group chat
        CHATROOM,           //chatroom chat
        DISCUSSIONGROUP,    //discussion group chat
        HELPDESK,           //help desk chat
    }EMConversationType;
    
    /**
     * Message search direction.
     */
    typedef enum {
        UP,            //Search older messages than reference
        DOWN,          //Search newer messages than reference
    }EMMessageSearchDirection;
    
    /**
      * \brief Conversation's destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMConversation();
    
    /**
      * \brief Get conversation id.
      *
      * Note: For a single chat conversation, it's remote peer's user name, for a group chat conversation, it's group id.
      * @param  NA
      * @return The conversation id.
      */
    const std::string& conversationId() const;
    
    /**
      * \brief Get conversation type.
      *
      * @param  NA
      * @return The conversation type.
      */
    EMConversationType conversationType () const;
    
    /**
      * \brief Remove a message from DB and cache.
      *
      * Note: It's user's responsibility to confirm removed message belongs to the conversation.
      * @param  The message id
      * @return Return false if message isn't exist in DB.
      */
    bool removeMessage(const std::string &msgId);
    
    /**
      * \brief Remove a message from DB and cache.
      *
      * Note: It's better to use this method to remove a message, 
        and it's user's responsibility to confirm removed message belongs to the conversation.
      * @param  The message to remove
      * @return Return false if message isn't exist in DB.
      */
    bool removeMessage(const EMMessagePtr msg);
    
    /**
      * \brief Insert a message to DB.
      *
      * Note: It's user's responsibility to confirm inserted message belongs to the conversation.
      * @param  The message to insert.
      * @return Return false if message can't insert to DB(e.g. has duplicate message with the same message id
        or user not login).
      */
    bool insertMessage(const EMMessagePtr msg);
    
    /**
      * \brief Append a message to the last of conversation.
      *
      * Note: It's user's responsibility to confirm inserted message belongs to the conversation.
      * @param  The message to append.
      * @return Return false if message can't insert to DB(e.g. has duplicate message with the same message id
        or user not login).
      */
    bool appendMessage(const EMMessagePtr msg);
    
    /**
      * \brief Update message's memory change to DB.
      *
      * Note: It's user's responsibility to confirm updated message belongs to the conversation, and user
        should NOT change a message's id.
      * @param  The message to remove
      * @return Return false if can't update message.
      */
    bool updateMessage(const EMMessagePtr msg);
    
    /**
      * \brief Clear all messages belong to the the conversation(include DB and memory cache).
      *
      * @param  NA
      * @return Return false if can't clear the messages.
      */
    bool clearAllMessages();
    
    /**
      * \brief Change message's read status.
      *
      * Note: It's user's responsibility to confirm changed message belongs to the conversation.
      * @param  The message to change.
      * @return Return false if message can't insert to DB(e.g. DB operation failed or read status doesn't need to change).
      */
    bool markMessageAsRead(const std::string &msgId, bool isRead = true);
    
    /**
      * \brief Change all messages's read status.
      *
      * @param  NA
      * @return Return false if can't change read status.
      */
    bool markAllMessagesAsRead(bool isRead = true);
    
    /**
      * \brief Get unread messages count of conversation.
      *
      * @param  NA
      * @return The unread messages count.
      */
    int unreadMessagesCount() const;
    
    /**
      * \brief Get the total messages count of conversation.
      *
      * @param  NA
      * @return The total messages count.
      */
    int messagesCount() const;
    
    /**
      * \brief Load a message(Will load message from DB if not exist in cache).
      *
      * @param  The message id
      * @return The loaded message.
      */
    EMMessagePtr loadMessage(const std::string &msgId) const;
    
    /**
      * \brief Get latest message of conversation.
      *
      * @param  NA
      * @return The latest message.
      */
    EMMessagePtr latestMessage() const;
    
    /**
      * \brief Get received latest message of conversation.
      *
      * @param  NA
      * @return The received latest message.
      */
    EMMessagePtr latestMessageFromOthers() const;
    
    /**
      * \brief Load specified number of messages from DB.
      *
      * Note: The return result will NOT include the reference message, 
        and load message from the latest message if reference message id is empty.
        The result will be sorted by ASC.
        The trailing position resident last arrived message;
      * @param  The reference messages's id
      * @param  Message count to load
      * @param  Message search direction
      * @return The loaded messages list.
      */
    EMMessageList loadMoreMessages(const std::string &refMsgId, int count, EMMessageSearchDirection direction = UP);
    
    /**
      * \brief Load specified number of messages before the timestamp from DB.
      *
      * Note: The result will be sorted by ASC.
      * @param  The reference timestamp
      * @param  Message count to load
      * @param  Message search direction
      * @return The loaded messages list.
      */
    EMMessageList loadMoreMessages(int64_t timeStamp, int count, EMMessageSearchDirection direction = UP);
    
    /**
      * \brief Load specified number of messages before the timestamp and with the specified type from DB.
      *
      * Note: The result will be sorted by ASC.
      * @param  Message type to load
      * @param  The reference timestamp, milliseconds, will reference current time if timestamp is negative
      * @param  Message count to load, will load all messages meeet the conditions if count is negative
      * @param  Message sender, will ignore it if it's empty
      * @param  Message search direction
      * @return The loaded messages list.
      */
    EMMessageList loadMoreMessages(EMMessageBody::EMMessageBodyType type, int64_t timeStamp = -1, int count = -1, const std::string &from = "", EMMessageSearchDirection direction = UP);
    
    /**
      * \brief Load specified number of messages before the timestamp and contains the specified keywords from DB.
      *
      * Note: The result will be sorted by ASC.
      * @param  Message contains keywords, will ignore it if it's empty
      * @param  The reference timestamp, milliseconds, will reference current time if timestamp is negative
      * @param  Message count to load, will load all messages meeet the conditions if count is negative
      * @param  Message sender, will ignore it if it's empty
      * @param  Message search direction
      * @return The loaded messages list.
      */
    EMMessageList loadMoreMessages(const std::string& keywords, int64_t timeStamp = -1, int count = -1, const std::string &from = "", EMMessageSearchDirection direction = UP);
    
    /**
      * \brief Load messages from DB.
      *
      * Note: To avoid occupy too much memory, user should limit the max messages count to load.
        The result will be sorted by ASC.
        The trailing position resident last arrived message;
      * @param  The start time timestamp
      * @param  The end time timestamp
      * @param  The max count of messages to load
      * @return The loaded messages list.
      */
    EMMessageList loadMoreMessages(int64_t startTimeStamp, int64_t endTimeStamp, int maxCount);
    
    /**
      * \brief Get conversation extend attribute.
      *
      * @param  NA
      * @return The extend attribute.
      */
    const std::string& extField() const;
    
    /**
      * \brief Set conversation extend attribute.
      *
      * @param  The extend attribute.
      * @return Return false if set extend attribute failed.
      */
    bool setExtField(const std::string &ext);
    
    friend EMConversationManager;
    friend EMChatManager;
    friend EMDatabase;
private:
    /**
      * \brief Private conversation constructor.
      *
      * Note: User can't directly create a conversation.
        User can create a conversation by method of chat manager if conversation isn't exist.
      * @param  Conversation id
      * @param  Conversation type
      * @return NA
      */
    EMConversation(const std::string &conversationId, EMConversationType type, const std::string& ext = "");
    
    /**
      * \brief Conversation can't copy and assign.
      */
    EMConversation& operator=(const EMConversation&);
    EMConversation(const EMConversation&);
    
    EMConversationPrivate *mPrivate;
};

typedef std::shared_ptr<EMConversation> EMConversationPtr;
typedef std::vector<EMConversationPtr> EMConversationList;

}

#endif /* defined(__easemob__emconversation__) */
