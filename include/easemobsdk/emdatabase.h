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
//  emdatabase.h
//  easemob
//
//  Created by Neil Cao on 15/7/15.
//
//

#ifndef __easemob__emdatabase__
#define __easemob__emdatabase__

#include <mutex>
#include <string>
#include <memory>
#include <list>

#include "sqlite.h"
#include "message/emmessage.h"
#include "emconversation.h"
#include "emmanager_base.h"
#include "emgroup.h"
#include "emchatroom.h"
#include <emstl.h>
#include "utils/emutils.h"
#include "message/emmessagebody.h"

namespace easemob
{

class EMConfigManager;
class EMDatabase
{
public:
    EMDatabase(EMPathUtilPtr);
    virtual ~EMDatabase();
    void open(const std::string &user);
    void close();
    void setConfigManager(const std::shared_ptr<EMConfigManager>);
    std::shared_ptr<EMConfigManager> getConfigManager(); 

    // ------ profile ------
    bool saveToken(const std::string &username, const std::string &value, int64_t time);
    bool getToken(const std::string &username, std::string &value, int64_t &time);
    bool saveRosterVersion(const std::string &version);
    std::string getRosterVersion();

    // --- message ---
    bool insertMessage(const EMMessagePtr);
    bool insertMessages(const EMMessageList &list);
    bool removeMessage(const std::string &msgId);
    bool removeMessageAttachments(const EMMessagePtr);
    bool updateMessage(const EMMessagePtr msg);
    bool markMessageAsRead(const std::string &msgId, bool isRead = true);
    bool updateMessageId(const std::string &from, const std::string &to);
    EMMessagePtr loadMessage(const std::string &msgId);
    
    // --- conversation ---
    bool clearAllConversationMessages(const std::string &conversationId);
    bool markConversationAllMessagesAsRead(const std::string &conversationId, bool isRead = true);
    int conversationUnreadMessagesCount(const std::string &conversationId);
    int conversationMessagesCount(const std::string &conversationId);
    bool isMessageAlreadyExist(const std::string &msgId);
    EMMessagePtr conversationLatestMessage(const std::string &conversationId);
    EMMessagePtr conversationLatestMessageFromOthers(const std::string &conversationId);
    EMMessageList loadMoreConversationMessages(const std::string &conversationId, const std::string &refMsgId, int count, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreConversationMessages(const std::string &conversationId, int64_t timestamp, int count, EMConversation::EMMessageSearchDirection direction);
    bool removeConversation(const std::string &conversationId, bool isRemoveMessages = true);
    bool insertConversation(const easemob::EMConversationPtr conversation);
    bool insertConversations(const EMConversationList &list);
    bool updateConversationExt(const std::string &conversationId, const std::string &ext);
    bool loadConversationInfo(const easemob::EMConversationPtr conversation);
    bool loadConversationInfo(easemob::EMConversationPrivate *conversation);
    EMConversationList loadAllConversationsFromDB(EMMap<std::string, EMConversationPtr> &existConversations);
    bool updateConversationUnreadCount(const std::string &conversationId, int count);
    EMMessageList loadMoreConversationMessages(const std::string &conversationId, int64_t timestamp, EMMessageBody::EMMessageBodyType type, int count, const std::string &from, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreConversationMessages(const std::string &conversationId, int64_t timestamp, const std::string &keyWord, int count, const std::string &from, EMConversation::EMMessageSearchDirection direction);
    EMMessageList loadMoreMessages(const std::string &conversationId, int64_t startTimeStamp, int64_t endTimeStamp, int maxCount);
    
    // --- contact ---
    void saveContact(const std::string &username);
    void saveContactList(const EMVector<std::string> &username_list);
    void deleteContact(const std::string &username);
    std::vector<std::string> loadContacts();
    bool clearAllContacts();
    
    // --- blacklist ---
    std::vector<std::string> getBlackList();
    void saveBlackList(const EMVector<std::string> &bList);
    void addToBlackList(const std::string &username);
    void removeFromBlackList(const std::string &username);
    bool clearBlackList();

    // --- group ---
    bool insertGroup(const EMGroupPtr group);
    bool insertGroups(const EMVector<EMGroupPtr> &groups);
    bool removeGroup(const std::string &groupId, bool removeConversation);
    bool updateGroup(const EMGroupPtr group);
    bool clearAllGroups();
    bool replaceAllGroups(const EMVector<EMGroupPtr> &groups);
    std::vector<EMGroupPtr> loadAllGroupsFromDB(EMMap<std::string, std::weak_ptr<EMGroup>>& existGroups);
    bool importGroup(const std::string &id, int style, const std::string &owner, const std::string &subject, const std::string &description, const EMVector<std::string> &members, bool isBlocked, int maxUsers);
    
    // ------ chatroom ------
    bool insertChatroom(const EMChatroomPtr chatroom);
    bool insertChatrooms(const EMVector<EMChatroomPtr> &list);
    bool removeChatroom(const std::string &chatroomId);
    bool clearAllChatrooms();
    std::vector<EMChatroomPtr> loadAllChatroomsFromDB(EMMap<std::string, std::weak_ptr<EMChatroom>>& existChatrooms);
    bool importChatroom(const std::string &id, const std::string & owner, const std::string &subject, const std::string &description, const EMVector<std::string> &members, int maxUsers);
    
    // --- misc ---
    void resetDB();
    
    // --- create ---
    EMConversationPtr createConversation(const std::string &cId, easemob::EMConversation::EMConversationType type, const std::string& ext = "");
    EMChatroomPtr createChatroom(const std::string &rId, const std::string& subject, const std::string& des, const std::string& owner = "");
    EMGroupPtr createGroup(const std::string &gId, const std::string& subject, const std::string& des, EMGroupSetting::EMGroupStyle style, int maxUserCount, const std::string& owner, std::vector<std::string> *members = nullptr, std::vector<std::string> *bans = nullptr, bool isBlocked = false);

private:
    void createTableIfNotExist(Connection &);
    EMMessagePtr messageFromStmt(Statement &stmt);
    EMConversationPtr conversationFromStmt(Statement &stmt);
    EMGroupPtr groupFromStmt(Statement &stmt, EMMap<std::string, std::weak_ptr<EMGroup>>& existGroups);
    EMChatroomPtr chatroomFromStmt(Statement &stmt, EMMap<std::string, std::weak_ptr<EMChatroom>>& existChatrooms);

    EMMessagePtr cachedMessageWithID(const std::string&);
    void clearMessageCache();
    void clearMessageForConversation(const std::string&);
    void markCachedMessagesAsReadForConversation(const std::string&, bool read);
    void insertMessageToCache(EMMessagePtr);
    void removeMessageFromCache(const std::string&);
    void updateCachedMessageId(const std::string &from, const std::string &to);
    
    void performMigrationIfNecessary();
    bool performMigrationFromVersion1();
    int getDBVersion();
    bool setDBVersion(int);
    
    EMPathUtilPtr mPathUtil;
    std::string groupMemberListToSaveString(const EMGroupMemberList*);
    EMGroupMemberList* saveStringToGroupMemberList(const char *);
    
    std::string mUser;
    std::recursive_mutex mMutex;
    Connection *mConnection;
    std::shared_ptr<EMConfigManager> mConfigManager;
    
    EMMap<std::string, std::weak_ptr<EMMessage>> mCachedMsgs;
    EMCallbackObserverHandle mCallbackHandler;
    EMCallbackPtr mCallback;
};

typedef std::shared_ptr<EMDatabase> EMDatabasePtr;

}

#endif /* defined(__easemob__emdatabase__) */
