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
//  emgroupprivate.h
//  easemob
//
//  Created by Neil Cao on 15/8/3.
//
//

#ifndef __easemob__emgroupprivate__
#define __easemob__emgroupprivate__

#include <mutex>
#include <string>
#include <vector>

#include "emgroupsetting.h"
#include "emerror.h"
#include "emconfigmanager.h"
#include "emsemaphoretracker.h"
#include "utils/emutils.h"
#include "rapidjson/document.h"
#include "chatclient.hpp"
#include "muc.hpp"
#include "algorithm"

namespace easemob
{

class EMGroupPrivate;
class EMGroupPrivateListener
{
public:
    virtual ~EMGroupPrivateListener() {}
    
    virtual void onLeaveGroup(const EMGroupPrivate* group, int reason) = 0;
    virtual std::string loginUser() = 0;
    virtual void onMemberJoined(const EMGroupPrivate* group, const std::string &user) {}
    virtual void onMemberLeft(const EMGroupPrivate* group, const std::string &user) {}
};

class EMGroupPrivate : public protocol::MUCOperationHandler
{
public:

    enum
    {
        BE_KICKED,
        DESTROYED
    };

    EMGroupPrivate(const std::string &id, bool isChatroom = false);
    
    virtual ~EMGroupPrivate();
    
    void createMUCRoomIfNecessary(protocol::ChatClient *client, const std::string &loginUser, const std::string &domain, const protocol::JID& mucId, EMGroupPrivateListener* listener);
    void destroyMUCRoomIfNecessary();
    
    static EMGroupSetting* groupSettingFromJsonObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &object);
    bool updateFromJsonObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &object);
    
    void setSetting(EMGroupSetting *setting)
    {
        std::lock_guard<std::recursive_mutex> lock(mMutex);
        if (mSetting != nullptr && setting != nullptr) {
            *mSetting = *setting;
            delete setting;
        }
        else if (mSetting != nullptr) {
            delete mSetting;
            mSetting = nullptr;
        }
        else {
            mSetting = setting;
        }
    }

    void addMember(const std::string& member, bool updateAffiliationsCount = true)
    {
        std::lock_guard<std::recursive_mutex> lock(mMutex);
        if (mMembers != nullptr && std::find(mMembers->begin(), mMembers->end(), member) == mMembers->end()) {
            mMembers->push_back(member);
            if (updateAffiliationsCount) {
                mAffiliationsCount++;
            }
        }
        else if (mMembers == nullptr && updateAffiliationsCount) {
            mAffiliationsCount++;
        }
    }
    
    void removeMember(const std::string& member)
    {
        std::lock_guard<std::recursive_mutex> lock(mMutex);
        std::vector<std::string>::iterator ite;
        if (mMembers != nullptr && (ite = std::find(mMembers->begin(), mMembers->end(), member)) != mMembers->end()) {
            mMembers->erase(ite);
            mAffiliationsCount--;
        }
        else if (mMembers == nullptr) {
            mAffiliationsCount--;
        }
    }
    
    void setMembers(std::vector<std::string> *members)
    {
        std::lock_guard<std::recursive_mutex> lock(mMutex);
        if (mMembers != nullptr && members != nullptr) {
            *mMembers = std::move(*members);
            delete members;
        }
        else if (mMembers != nullptr) {
            delete mMembers;
            mMembers = nullptr;
        } 
        else {
            mMembers = members;
        }
    }
    
    void setBans(std::vector<std::string> *bans)
    {
        std::lock_guard<std::recursive_mutex> lock(mMutex);
        if (mBans != nullptr && bans != nullptr) {
            *mBans = std::move(*bans);
            delete bans;
        }
        else if (mBans != nullptr) {
            delete mBans;
            mBans = nullptr;
        }
        else {
            mBans = bans;
        }
    }
    
    EMError::EMErrorCode fetchGroupSpecification(const std::shared_ptr<EMConfigManager> configManager, bool fetchOccupants);
    EMError::EMErrorCode fetchGroupBans();
    EMError::EMErrorCode fetchGroupBans(const std::shared_ptr<EMConfigManager> configManager);
    EMError::EMErrorCode inviteOccupants(const std::vector<std::string> &occupants, const std::string &welcomeMessage);
    EMError::EMErrorCode removeOccupants(const std::vector<std::string> &occupants);
    EMError::EMErrorCode changeSubject(const std::string& newSubject);
    EMError::EMErrorCode changeDescription(const std::string& newDescription);
    EMError::EMErrorCode joinGroup(const std::string& loginUser);
    EMError::EMErrorCode quiteGroup(const std::string& loginUser);
    EMError::EMErrorCode leaveGroup(const std::string& loginUser);
    EMError::EMErrorCode applyJoinGroup(const std::string& loginUser, const std::string& nick, const std::string& message);
    EMError::EMErrorCode destroyGroup();
    EMError::EMErrorCode blockOccupants(const std::vector<std::string> &occupants, const std::string &reason);
    EMError::EMErrorCode blockOccupants(const std::shared_ptr<EMConfigManager> configManager, const std::vector<std::string> &occupants);
    EMError::EMErrorCode unblockOccupants(const std::vector<std::string> &occupants);
    EMError::EMErrorCode unblockOccupants(const std::shared_ptr<EMConfigManager> configManager, const std::vector<std::string> &occupants);
    EMError::EMErrorCode blockMessage(const std::string& loginUser);
    EMError::EMErrorCode unblockMessage(const std::string& loginUser);
    EMError::EMErrorCode create(const std::string& subject, const std::string &description, const EMGroupSetting &setting);
    EMError::EMErrorCode create(const std::string& subject, const std::string &description, const EMGroupSetting &setting, const std::vector<std::string> &occupants, const std::string &welcomeMessage);
    EMError::EMErrorCode acceptJoinApplication(const std::string &user);
    EMError::EMErrorCode declineJoinApplication(const std::string &user, const std::string &reason);
    EMError::EMErrorCode acceptInvitation(const std::string &inviter);
    EMError::EMErrorCode declineInvitation(const std::string &inviter, const std::string &reason);
    void cancelBlockingOperation(EMError::EMErrorCode reason);

    //MUCOperationHandler
    virtual bool handleMUCOperationResult(protocol::MUC* muc, protocol::MUCBody::Operation, bool success, const protocol::MUCBody& body);
    virtual void handleMUCOperationResult(protocol::MUC* muc, protocol::MUCBody::Operation, bool success, const protocol::SyncDL&);
    EMError::EMErrorCode errorFromStatus(const protocol::Status*);
    EMError::EMErrorCode errorFromStatus(const protocol::MUCBody::Status*);

    bool isBusyForOperation(protocol::MUCBody::Operation);
    inline std::string identifierForOperation(protocol::MUCBody::Operation operation)
    {
        return "muc_" + mId + "_" + EMStringUtil::to_string(operation);
    }
    
    inline EMError::EMErrorCode wait(const std::string& identifier);
    
    std::recursive_mutex mMutex;
    
    bool mIsChatroom;
    std::string mId;
    std::string mSubject;
    std::string mDescription;
    std::string mOwner;
    EMGroupSetting *mSetting;
    int mAffiliationsCount;
    bool mIsPushEnabled;
    bool mIsShield;
    std::vector<std::string> *mMembers;
    std::vector<std::string> *mBans;
    protocol::MUC *mMUCRoom;
    std::string mDomain;
    std::string mLoginUser;
    EMGroupPrivateListener *mListener;
    EMSemaphoreTrackerPtr mTracker;
};

}

#endif /* defined(__easemob__emgroupprivate__) */
