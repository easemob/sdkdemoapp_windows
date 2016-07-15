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

#ifndef __easemob__emgroupmanager_listener__
#define __easemob__emgroupmanager_listener__

#include "emgroup.h"

#include <string>

namespace easemob
{

class EASEMOB_API EMGroupManagerListener
{
public:
    virtual ~EMGroupManagerListener() {}
    
    /**
      * \brief Callback user when user is invited to a group.
      *
      * Note: User can accept or decline the invitation.
      * @param  The group that invite the user.
      * @param  The inviter.
      * @param  The invite message.
      * @return NA
      */
    virtual void onReceiveInviteFromGroup(const std::string groupId, const std::string& inviter, const std::string& inviteMessage) {}
    
    /**
      * \brief Callback user when the user accept to join the group.
      *
      * @param  The group that invite the user.
      * @return NA
      */
    virtual void onReceiveInviteAcceptionFromGroup(const EMGroupPtr group, const std::string& invitee) {}
    
    /**
      * \brief Callback user when the user decline to join the group.
      *
      * @param  The group that invite the user.
      * @param  User's decline reason.
      * @return NA
      */
    virtual void onReceiveInviteDeclineFromGroup(const EMGroupPtr group, const std::string& invitee, const std::string &reason) {}
    
    /**
      * \brief Callback user when user is invited to a group.
      *
      * Note: User has been added to the group when received this callback.
      * @param  The group that invite the user.
      * @param  The inviter.
      * @param  The invite message.
      * @return NA
      */
    virtual void onAutoAcceptInvitationFromGroup(const EMGroupPtr group, const std::string& inviter, const std::string& inviteMessage) {}
    
    /**
      * \brief Callback user when user is kicked out from a group or the group is destroyed.
      *
      * @param  The group that user left.
      * @param  The leave reason.
      * @return NA
      */
    virtual void onLeaveGroup(const EMGroupPtr group, EMGroup::EMGroupLeaveReason reason) {}
    
    /**
      * \brief Callback user when receive a join group application.
      *
      * @param  The group that user try to join.
      * @param  User that try to join the group.
      * @param  The apply message.
      * @return NA
      */
    virtual void onReceiveJoinGroupApplication(const EMGroupPtr group, const std::string& from, const std::string& message) {}
    
    /**
      * \brief Callback user when receive owner's approval.
      *
      * @param  The group to join.
      * @return NA
      */
    virtual void onReceiveAcceptionFromGroup(const EMGroupPtr group) {}
    
    /**
      * \brief Callback user when receive group owner's rejection.
      *
      * @param  The group that user try to join.
      * @param  Owner's reject reason.
      * @return NA
      */
    virtual void onReceiveRejectionFromGroup(const std::string &groupId, const std::string &reason) {}
    
    /**
      * \brief Callback user when login user's group list is updated.
      *
      * @param  The login user's group list.
      * @return NA
      */
    virtual void onUpdateMyGroupList(const std::vector<EMGroupPtr> &list) {};
};

}

#endif /* defined(__easemob__emgroupmanager_listener__) */
