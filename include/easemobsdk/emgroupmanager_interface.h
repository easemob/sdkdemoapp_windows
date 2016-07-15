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

#ifndef EMCORE_GROUPMANAGER_INTERFACE_H
#define EMCORE_GROUPMANAGER_INTERFACE_H

#include <vector>
#include <string>

#include "emgroup.h"
#include "emerror.h"
#include "emcursorresult.h"
#include "emgroupmanager_listener.h"

namespace easemob {

typedef std::vector<EMGroupPtr> EMGroupList;

class EASEMOB_API EMGroupManagerInterface {
public:
    virtual ~EMGroupManagerInterface() {};
    
    /**
      * \brief Add a listener to group manager.
      *
      * @param  A group manager listener.
      * @return NA
      */
    virtual void addListener(EMGroupManagerListener*) = 0;
    
    /**
      * \brief Remove a listener.
      *
      * @param  A group manager listener.
      * @return NA
      */
    virtual void removeListener(EMGroupManagerListener*) = 0;
    
    /**
      * \brief Remove all the listeners.
      *
      * @param  NA
      * @return NA
      */
    virtual void clearListeners() = 0;
    
    /**
      * \brief Get a group with groupId, create the group if not exist.
      *
      * @param  Group's id.
      * @return A group with the groupId.
      */
    virtual EMGroupPtr groupWithId(const std::string& groupId) = 0;
    
    /**
      * \brief Get groups for login user from memory.
      *
      * @param  EMError used for output.
      * @return All user joined groups in memory.
      */
    virtual EMGroupList allMyGroups(EMError &error) = 0;
    
    /**
     * \brief Get groups for login user from db.
     *
     * @return All user joined groups in db.
     */
    virtual EMGroupList loadAllMyGroupsFromDB() = 0;
    
    /**
      * \brief Fetch all groups for login user from server.
      *
      * Note: Groups in memory will be updated.
      * @param  EMError used for output.
      * @return All user joined groups.
      */
    virtual EMGroupList fetchAllMyGroups(EMError &error) = 0;
    
    /**
      * \brief Fetch app's public groups.
      *
      * Note: User can input empty string as cursor at the first time.
      * @param  Page's cursor.
      * @param  Page's size.
      * @param  EMError used for output.
      * @return Wrapper of next page's cursor and current page result.
      */
    virtual EMCursorResult fetchPublicGroupsWithCursor(
        const std::string &cursor,
        int pageSize,
        EMError &error) = 0;
    
    /**
      * \brief Create a new group.
      *
      * Note: Login user will be the owner of created .
      * @param  Group's subject.
      * @param  Group's description.
      * @param  Welcome message that will be sent to invited user.
      * @param  Group's setting.
      * @param  Group's members.
      * @param  EMError used for output.
      * @return The created group.
      */
    virtual EMGroupPtr createGroup(
        const std::string &subject,
        const std::string &description,
        const std::string &welcomeMessage,
        const EMGroupSetting &setting,
        const EMGroupMemberList &members,
        EMError &error) = 0;
    
    /**
      * \brief Join a public group.
      *
      * Note: The group's style must be PUBLIC_JOIN_OPEN, or will return error.
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The joined group.
      */
    virtual EMGroupPtr joinPublicGroup(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Apply to join a public group, need owner's approval.
      *
      * Note: The group's style must be PUBLIC_JOIN_APPROVAL, or will return error.
      * @param  Group's ID.
      * @param  Nick name in the group.
      * @param  Apply message, that will be sent to group owner.
      * @param  EMError used for output.
      * @return The group that try to join.
      */
    virtual EMGroupPtr applyJoinPublicGroup(
        const std::string &groupId,
        const std::string &nickName,
        const std::string &message,
        EMError &error
        ) = 0;
    
    /**
      * \brief Leave a group.
      *
      * Note: Group's owner can't leave the group.
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The leaved group.
      */
    virtual EMGroupPtr leaveGroup(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Destroy a group.
      *
      * Note: Only group's owner can destroy the group.
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The destroyed group.
      */
    virtual EMGroupPtr destroyGroup(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Add members to a group.
      *
      * Note: Maybe user don't have the priviledge, it depends on group's setting.
      * @param  Group's ID.
      * @param  Invited users.
      * @param  Welcome message that will be sent to invited user.
      * @param  EMError used for output.
      * @return The group that added members.
      */
    virtual EMGroupPtr addGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        const std::string &welcomeMessage,
        EMError &error
        ) = 0;
    
    /**
      * \brief Remove members from a group.
      *
      * Note: Only group's owner can remove members.
      * @param  Group's ID.
      * @param  Removed users.
      * @param  EMError used for output.
      * @return The group that removed members.
      */
    virtual EMGroupPtr removeGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error
        ) = 0;
    
    /**
      * \brief Block group's members, the blocked user can't send message in the group.
      *
      * Note: Only group's owner can block other members.
      * @param  Group's ID.
      * @param  Blocked users.
      * @param  EMError used for output.
      * @param  The reason that why block the members.
      * @return The group that blocked members.
      */
    virtual EMGroupPtr blockGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error,
        const std::string &reason = ""
        ) = 0;
    
    /**
      * \brief Unblock group's members.
      *
      * Note: Only group's owner can unblock other members.
      * @param  Group's ID.
      * @param  Unblocked users.
      * @param  EMError used for output.
      * @return The group that unblocked members.
      */
    virtual EMGroupPtr unblockGroupMembers(
        const std::string &groupId,
        const EMGroupMemberList &members,
        EMError &error
        ) = 0;
    
    /**
      * \brief Change group's subject.
      *
      * Note: Only group's owner can change group's subject.
      * @param  Group's ID.
      * @param  The new group subject.
      * @param  EMError used for output.
      * @return The group that with new subject.
      */
    virtual EMGroupPtr changeGroupSubject(
        const std::string &groupId,
        const std::string &newSubject,
        EMError &error
        ) = 0;
    
    /**
      * \brief Change group's description.
      *
      * Note: Only group's owner can change group's description.
      * @param  Group's ID.
      * @param  The new group description.
      * @param  EMError used for output.
      * @return The group that with new description.
      */
    virtual EMGroupPtr changeGroupDescription(
        const std::string &groupId,
        const std::string &newDescription,
        EMError &error
        ) = 0;
    
    /**
      * \brief Get group's specification.
      *
      * @param  Group's ID.
      * @param  EMError used for output.
      * @param  Whether get group's members.
      * @return The group that update it's specification.
      */
    virtual EMGroupPtr fetchGroupSpecification(
        const std::string &groupId,
        EMError &error,
        bool fetchMembers = true
        ) = 0;
    
    /**
      * \brief Get group's black list.
      *
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The group's black list.
      */
    virtual const EMGroupMemberList* fetchGroupBans(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Search for a public group.
      *
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The search result.
      */
    virtual EMGroupPtr searchPublicGroup(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Block group message.
      *
      * Note: Owner can't block the group message.
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The group that blocked message.
      */
    virtual EMGroupPtr blockGroupMessage(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Unblock group message.
      *
      * @param  Group's ID.
      * @param  EMError used for output.
      * @return The group that unclocked message.
      */
    virtual EMGroupPtr unblockGroupMessage(
        const std::string &groupId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Accept user's join application.
      *
      * Note: Only group's owner can approval someone's application.
      * @param  Group's ID.
      * @param  The user that send the application.
      * @param  EMError used for output.
      * @return NA.
      */
    virtual void acceptJoinGroupApplication(
        const std::string &groupId,
        const std::string &user,
        EMError &error) = 0;
    
    /**
      * \brief Reject user's join application.
      *
      * Note: Only group's owner can reject someone's application.
      * @param  Group's ID.
      * @param  The user that send the application.
      * @param  The reject reason.
      * @param  EMError used for output.
      * @return NA.
      */
    virtual void declineJoinGroupApplication(
        const std::string &groupId,
        const std::string &user,
        const std::string &reason,
        EMError &error) = 0;
    
    /**
      * \brief accept group's invitation.
      *
      * @param  Group's ID.
      * @param  Inviter.
      * @param  EMError used for output.
      * @return The group user has accepted.
      */
    virtual EMGroupPtr acceptInvitationFromGroup(
        const std::string &groupId,
        const std::string &inviter,
        EMError &error) = 0;
    
    /**
      * \brief decline group's invitation.
      *
      * @param  Group's ID.
      * @param  Inviter.
      * @param  The decline reason.
      * @param  EMError used for output.
      * @return NA.
      */
    virtual void declineInvitationFromGroup(
        const std::string &groupId,
        const std::string &inviter,
        const std::string &reason,
        EMError &error) = 0;
};

}

#endif
