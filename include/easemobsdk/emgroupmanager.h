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
#ifndef EMCORE_GROUPMANAGER_H
#define EMCORE_GROUPMANAGER_H

#include "emgroupmanager_interface.h"
#include "emmanager_base.h"
#include "emconfigmanager.h"
#include "emsessionmanager.h"
#include "emdatabase.h"
#include "emtaskqueue.h"
#include "emgroupprivate.h"
#include "emchatmanager.h"
#include "rapidjson/document.h"
#include "muceventhandler.h"
#include "chatclient.hpp"
#include <atomic>

using std::cout;
using std::endl;

namespace easemob {

class EMGroupManager : public EMGroupManagerInterface, public EMManagerBase, public protocol::MucEventHandler, public EMGroupPrivateListener, public EMConnectionListener
{
public:
    EMGroupManager(const std::shared_ptr<EMConfigManager>, const std::shared_ptr<EMSessionManager>,  const EMDatabasePtr, EMChatManagerInterface *chatManager);
    virtual ~EMGroupManager();
    
    /**
      * \brief Add a listener to group manager.
      *
      * @param  NA
      * @return NA
      */
    virtual void addListener(EMGroupManagerListener*);
    
    /**
      * \brief Remove a listener.
      *
      * @param  NA
      * @return NA
      */
    virtual void removeListener(EMGroupManagerListener*);
    
    /**
      * \brief Remove all the listeners.
      *
      * @param  NA
      * @return NA
      */
    virtual void clearListeners();
    
    virtual void onInit();
    virtual void onDestroy();
    
    virtual EMGroupPtr groupWithId(const std::string& groupId);
    
    virtual EMGroupList loadAllMyGroupsFromDB();
    
    virtual EMGroupList allMyGroups(EMError &error);
    
    virtual EMGroupList fetchAllMyGroups(EMError &error);
    
    virtual EMCursorResult fetchPublicGroupsWithCursor(
        const std::string &cursor,
        int pageSize,
        EMError &error);
    
    virtual EMGroupPtr createGroup(
        const std::string &subject,
        const std::string &description,
        const std::string &welcomeMessage,
        const EMGroupSetting &setting,
        const EMGroupMemberList &members,
        EMError &error);
    
    virtual EMGroupPtr joinPublicGroup(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr applyJoinPublicGroup(
        const std::string &groupId,
        const std::string &nickName,
        const std::string &message,
        EMError &error
        );
    
    virtual EMGroupPtr leaveGroup(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr destroyGroup(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr addGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        const std::string &welcomeMessage,
        EMError &error
        );
    
    virtual EMGroupPtr removeGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error
        );
    
    virtual EMGroupPtr blockGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error,
        const std::string &reason = ""
        );
    
    virtual EMGroupPtr unblockGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error
        );
    
    virtual EMGroupPtr changeGroupSubject(
        const std::string &groupId,
        const std::string &newSubject,
        EMError &error
        );
    
    virtual EMGroupPtr changeGroupDescription(
        const std::string &groupId,
        const std::string &newDescription,
        EMError &error
        );
    
    virtual EMGroupPtr fetchGroupSpecification(
        const std::string &groupId,
        EMError &error,
        bool fetchMembers = true
        );
    
    virtual const EMGroupMemberList* fetchGroupBans(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr searchPublicGroup(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr blockGroupMessage(
        const std::string &groupId,
        EMError &error
        );
    
    virtual EMGroupPtr unblockGroupMessage(
        const std::string &groupId,
        EMError &error
        );
    
    virtual void acceptJoinGroupApplication(
        const std::string &groupId,
        const std::string &user,
        EMError &error);
    
    virtual void declineJoinGroupApplication(
        const std::string &groupId,
        const std::string &user,
        const std::string &reason,
        EMError &error);
    
    virtual EMGroupPtr acceptInvitationFromGroup(
        const std::string &groupId,
        const std::string &inviter,
        EMError &error);
    
    virtual void declineInvitationFromGroup(
        const std::string &groupId,
        const std::string &inviter,
        const std::string &reason,
        EMError &error);
    
    //MucEventHandler
    virtual void handleMUCOperation(const protocol::MUCBody&);
    
    virtual void onLeaveGroup(const EMGroupPrivate* group, int reason);
    virtual std::string loginUser();
    
    void insertMyGroup(const EMGroupPtr group);
    
    virtual void onConnect();
    virtual void onDisconnect(EMErrorPtr);
    
private:
    void clearMyGroups();
    void addMyGroups(const EMGroupList &groups);
    void updateMyGroups(const EMGroupList &groups);
    void clearReleasedGroups();
    EMGroupPtr joinedGroupById(const std::string &groupId);
    EMGroupPtr joinedGroup(const EMGroupPrivate*);
    EMGroupMemberList removeLoginUserAndDuplicate(const EMGroupMemberList&);
    void removeMyGroup(const std::string& groupId);
    void initGroup(const EMGroupPtr group);
    
    void callbackAutoAcceptInvite(const std::string& groupId, const std::string& inviter, const std::string& msg);
    void callbackDirectJoinedGroup(const std::string& groupId, const std::string& inviter, const std::string& msg);
    void callbackApplyToJoinGroup(const std::string& groupId, const std::string& from, const std::string& msg);
    void callbackLeaveGroup(const EMGroupPtr group, EMGroup::EMGroupLeaveReason);
    void callbackAcceptionFromGroup(const std::string& groupId);
    void callbackRejectionFromGroup(const std::string& groupId, const std::string& reason);
    void callbackMyGroupListUpdate();
    void callbackInviteToJoinGroup(const std::string& groupId, const std::string& inviter, const std::string& msg);
    void callbackInviteAcception(const std::string& groupId, const std::string& invitee);
    void callbackInviteDecline(const std::string& groupId, const std::string& invitee, const std::string& reason);
    
    EMGroupPtr groupFromJsonObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &object);
    EMGroupPtr publicGroupFromJsonObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &object);
    
    EMSet<EMGroupManagerListener*> mListeners;
    EMMap<std::string, EMGroupPtr> mMyGroups;
    EMMap<std::string, std::weak_ptr<EMGroup>> mAllGroups;
    EMMap<std::string, EMGroupPtr> mOperatingGroups;
    std::shared_ptr<EMConfigManager> mConfigManager;
    std::shared_ptr<EMSessionManager> mSessionManager;
    std::unique_ptr<protocol::ChatClient> &mClient;
    EMDatabasePtr mDatabase;
    EMChatManagerInterface *mChatManager;
    std::string mDomain;
    std::string mGroupDomain;
    EMTaskQueueThreadPtr mCallbackThread;
    std::atomic<bool> mDbLoaded;
};

}

#endif
