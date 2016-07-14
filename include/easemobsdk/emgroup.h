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

#ifndef __easemob__emgroup__
#define __easemob__emgroup__

#include "emgroupsetting.h"
#include "embaseobject.h"

#include <string>
#include <vector>
#include <memory>

namespace easemob
{

typedef std::vector<std::string> EMGroupMemberList;

class EMGroupPrivate;
class EMGroupManager;
class EMDatabase;
class EASEMOB_API EMGroup : public EMBaseObject
{
public:
    
    typedef enum
    {
        BE_KICKED,      //User is kicked out by the group owner
        DESTROYED       //Group was destroyed by the group owner.
    } EMGroupLeaveReason;
    
    virtual ~EMGroup();
    
    /**
      * \brief Get group's ID.
      *
      * @param  NA
      * @return Group's ID.
      */
    const std::string& groupId() const;
    
    /**
      * \brief Get group's subject.
      *
      * @param  NA
      * @return Group's subject。
      */
    const std::string& groupSubject() const;
    
    /**
      * \brief Get group's description.
      *
      * @param  NA
      * @return Group's description
      */
    const std::string& groupDescription() const;
    
    /**
      * \brief Get group's owner.
      *
      * @param  NA
      * @return Group's owner
      */
    const std::string& groupOwner() const;
    
    /**
      * \brief Get group's setting.
      *
      * Note: Will return nullptr if have not ever got group's specification.
      * @param  NA
      * @return Group's setting.
      */
    const EMGroupSetting* groupSetting() const;
    
    /**
      * \brief Get current members count.
      *
      * Note: Will return 0 if have not ever got group's specification.
      * @param  NA
      * @return Members count
      */
    int groupMembersCount() const;
    
    /**
      * \brief Get whether push is enabled status.
      *
      * @param  NA
      * @return Push status.
      */
    bool isPushEnabled() const;
    
    /**
      * \brief Get whether group messages is blocked.
      *
      * Note: Group owner can't block group message.
      * @param  NA
      * @return Group message block status.
      */
    bool isMessageBlocked() const;
    
    /**
      * \brief Get group's member list.
      *
      * Note: Will return nullptr if have not ever got group's members.
      * @param  NA
      * @return Group's member list.
      */
    const EMGroupMemberList* groupMembers() const;
    
    /**
      * \brief Get group's bans.
      *
      * Note: Will return nullptr if have not ever got group's bans.
      * @param  NA
      * @return Group's bans list.
      */
    const EMGroupMemberList* groupBans() const;
private:
    /**
      * \brief Constructor.
      *
      * Note: User can‘t directly create a group.
      * @param  Group's ID
      * @return NA.
      */
    EMGroup(const std::string &groupId);
    EMGroup(const EMGroup&);
    EMGroup& operator=(const EMGroup&);
    
    EMGroupPrivate *mPrivate;
    friend EMGroupManager;
    friend EMDatabase;
};

typedef std::shared_ptr<EMGroup> EMGroupPtr;

}

#endif /* defined(__easemob__emgroup__) */
