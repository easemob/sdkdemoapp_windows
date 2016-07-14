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

#ifndef __easemob__emgroupsetting__
#define __easemob__emgroupsetting__

#include "embaseobject.h"
#include <memory>

namespace easemob
{

class EASEMOB_API EMGroupSetting : public EMBaseObject
{
public:

    typedef enum{
        PRIVATE_OWNER_INVITE,   //Private group, only group owner can invite user to the group
        PRIVATE_MEMBER_INVITE,  //Private group, both group owner and members can invite user to the group
        PUBLIC_JOIN_APPROVAL,   //Public group, user can apply to join the group, but need group owner's approval, and owner can invite user to the group
        PUBLIC_JOIN_OPEN,       //Public group, any user can freely join the group, and owner can invite user to the group
        PUBLIC_ANONYMOUS,       //Anonymous group, NOT support now
        DEFAUT = PRIVATE_OWNER_INVITE
    } EMGroupStyle;
    
    EMGroupSetting(EMGroupStyle style = DEFAUT, int maxUserCount = 200) : mStyle(style), mMaxUserCount(maxUserCount)
    {}
    EMGroupSetting(const EMGroupSetting& a) {
        mStyle = a.mStyle;
        mMaxUserCount = a.mMaxUserCount;
    }
    
    virtual ~EMGroupSetting() {}
    
    EMGroupStyle style() const { return mStyle; }
    void setStyle(EMGroupStyle style) { mStyle = style; }
    
    int maxUserCount() const { return mMaxUserCount; }
    void setMaxUserCount(int maxUserCount) { mMaxUserCount = maxUserCount; }
    
    EMGroupSetting& operator=(const EMGroupSetting &a) {
        mStyle = a.mStyle;
        mMaxUserCount = a.mMaxUserCount;
        return *this;
    }

private:
    EMGroupStyle mStyle;
    int mMaxUserCount;
};
    
typedef std::shared_ptr<EMGroupSetting> EMGroupSettingPtr;

}

#endif /* defined(__easemob__emgroupsetting__) */
