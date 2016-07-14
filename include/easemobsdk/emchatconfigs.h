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
//  emchatconfigs.h
//  easemob
//

#ifndef emchatconfigs_h
#define emchatconfigs_h

#include <iostream>
#include <memory>
#include "emcallback.h"

namespace easemob {

/**
 * User configs, SDK will not make them persistent.
 * If user want to change it: call get
 */
class EMChatPrivateConfigs;
class EASEMOB_API EMChatConfigs {
public:
    typedef enum
    {
        OS_IOS     = 0,
        OS_ANDROID = 1,
        OS_LINUX   = 2,
        OS_OSX     = 3,
        OS_WIN     = 4,
        OS_OTHER   = 16,
    } OSType;
    
    typedef enum
    {
        DEBUG_LEVEL,
        WARNING_LEVEL,
        ERROR_LEVEL
    } EMLogLevel;
    
    EMChatConfigs(const std::string &resourcePath, const std::string &workPath, const std::string &appkey, unsigned int deviceId = 0);
    virtual ~EMChatConfigs();
    
    void setUsingHttps(bool usingHttps) { mIsUsingHttps = usingHttps;}
    
    bool getUsingHttps() { return mIsUsingHttps; }
    
    void setUseEncryption(bool useEncryption) { mUseEncryption = useEncryption; }
    
    bool getUseEncryption() { return mUseEncryption; }
    
    void setSortMessageByServerTime(bool sortByServerTime) { mSortByServerTime = sortByServerTime; }
    
    bool getSortMessageByServerTime() { return mSortByServerTime; }
    
    void setNetCallback(const EMNetCallbackPtr callback) {
        mNetCallback = callback;
    }
    
    EMNetCallbackPtr getNetCallback() {
        return mNetCallback;
    }
    
    /**
      * \brief Get the resource path.
      * 
      * @param  NA.
      * @return resource path.
      */
    const std::string& getResourcePath() const { return mResourcePath; }
    
    /**
      * \brief Get the work path.
      * 
      * @param  NA.
      * @return work path.
      */
    const std::string& getWorkPath() const {return mWorkPath; }
    
    /**
      * \brief Set the log path.
      * 
      * Note: This path can't change in run time.
      * @param  NA.
      * @return log path.
      */
    void setLogPath(const std::string& path) { mLogPath = path; }
    
    const std::string& getLogPath() const { return mLogPath; }
    
    /**
      * \brief Set the download path.
      * 
      * Note: This path can't change in run time.
      * @param  NA.
      * @return download path.
      */
    void setDownloadPath(const std::string& path) { mDownloadPath = path; }
    
    const std::string& getDownloadPath() const { return mDownloadPath; }
    
    /**
      * \brief Get the app key.
      * 
      * @param  NA.
      * @return app key.
      */
    const std::string& getAppKey() const {return mAppKey; }

    /**
      * \brief set sandbox mode.
      * 
      * Default is false.
      * @param  true or false.
      * @return NA.
      */    
    void setIsSandboxMode(bool b) { mIsSandboxMode = b; }
    
    /**
      * \brief get sandbox mode.
      * 
      * @param  NA.
      * @return true or false.
      */ 
    bool getIsSandboxMode() const {return mIsSandboxMode; }
    
    /**
      * \brief set if output the log to console.
      * 
      * Default is false.
      * @param  true or false.
      * @return NA.
      */
    void setEnableConsoleLog(bool b) { mEnableConsoleLog = b; }
    
    /**
      * \brief get if output the log to console.
      * 
      * @param  true or false.
      * @return NA.
      */
    bool getEnableConsoleLog() const { return mEnableConsoleLog; }
    
    /**
      * \brief set if auto accept friend invitation.
      * 
      * Default is false.
      * @param  true or false.
      * @return NA.
      */
    void setAutoAcceptFriend(bool b) {mAutoAcceptFriend = b; }
    
    /**
      * \brief get if auto accept friend invitation.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getAutoAcceptFriend() const { return mAutoAcceptFriend; }
    
    /**
      * \brief set if auto accept group invitation.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setAutoAcceptGroup(bool b) {mAutoAcceptGroup = b; }
    
    /**
      * \brief get if auto accept group invitation.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getAutoAcceptGroup() const { return mAutoAcceptGroup; }
    
    /**
      * \brief set if need message read ack.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setRequireReadAck(bool b) { mRequireReadAck = b; }
    
    /**
      * \brief get if need message read ack.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getRequireReadAck() const {return mRequireReadAck; }
    
    /**
      * \brief set if need message delivery ack.
      * 
      * Default is false.
      * @param  true or false.
      * @return NA.
      */
    void setRequireDeliveryAck(bool b) { mRequireDeliveryAck = b; }
    
    /**
      * \brief get if need message delivery ack.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getRequireDeliveryAck() const {return mRequireDeliveryAck; }
    
    /**
      * \brief set if need message server receive ack.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setRequireServerAck(bool b) { mRequireServerAck = b; }
    
    /**
      * \brief get if need message server receive ack.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getRequireServerAck() const { return mRequireServerAck; }
    
    /**
      * \brief set if need load all conversation when login.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setAutoConversationLoaded(bool b) { mAutoConversationsLoaded = b; }
    
    /**
      * \brief get if load all conversation when login.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getAutoConversationLoaded() const { return mAutoConversationsLoaded; }
    
    /**
      * \brief set if delete message when exit group.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setDeleteMessageAsExitGroup(bool b) { mDeleteMessagesAsExitGroup = b; }
    
    /**
      * \brief get if delete message when exit group.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getDeleteMessageAsExitGroup() const { return mDeleteMessagesAsExitGroup; }
    
    /**
      * \brief set if chatroom owner can leave.
      * 
      * Default is true.
      * @param  true or false.
      * @return NA.
      */
    void setIsChatroomOwnerLeaveAllowed(bool b) { mIsChatroomOwnerLeaveAllowed = b; }
    
    /**
      * \brief get if chatroom owner can leave.
      * 
      * @param  NA.
      * @return true or false.
      */
    bool getIsChatroomOwnerLeaveAllowed() const {return mIsChatroomOwnerLeaveAllowed; }
    
    /**
      * \brief set the number of message load at first time.
      * 
      * Default is 20.
      * @param  true or false.
      * @return NA.
      */
    void setNumOfMessageLoaded(int n) { if(n > 0) mNumOfMessageLoaded = n; }
    
    /**
      * \brief get the number of message load at first time.
      * 
      * Default is 20.
      * @param 
      * @return number of messages.
      */
    int  getNumOfMessageLoaded() const { return mNumOfMessageLoaded; }
    
    /**
      * \brief set os type.
      *
      * @param  os type.
      * @return NA.
      */    
    void setOs(const OSType os) { mOs = os; }
    
    /**
      * \brief get os type.
      * 
      * @param  NA.
      * @return os type.
      */ 
    OSType getOs() const {return mOs; }
    
    /**
      * \brief set os version.
      *
      * @param  os version.
      * @return NA.
      */    
    void setOsVersion(const std::string& version) { mOsVersion = version; }
    
    /**
      * \brief get os version.
      * 
      * @param  NA.
      * @return os version.
      */ 
    const std::string& getOsVersion() const {return mOsVersion; }
    
    /**
      * \brief set sdk version.
      *
      * @param  sdk version.
      * @return NA.
      */    
    void setSdkVersion(const std::string &version) { mSdkVersion = version; }
    
    /**
      * \brief get sdk version.
      * 
      * @param  NA.
      * @return sdk version.
      */ 
    const std::string& getSdkVersion() const {return mSdkVersion; }

    /**
      * \brief get device unique id.
      * 
      * @param  NA.
      * @return device unique id.
      */ 
    unsigned int getDeviceID() const {return mDeviceID; }
    
    /**
     * \brief set client resource
     *
     * @param resource
     */
    void setClientResource(const std::string &resource) { mClientResource = resource; }
    
    /**
     * \brief get client resource
     *
     * @return resource
     */
    const std::string& clientResource() { return mClientResource; }
    
    /**
      * \brief Set log output level
      * 
      * @param  log output level
      */ 
    void setLogLevel(EMLogLevel level);
    
    EMChatPrivateConfigs& privateConfigs() { return *mPrivateConfigs; }

    void setDeleteMessageAsExitChatRoom(bool b){mDeleteMessagesAsExitChatRoom = b;}

    bool getDeleteMessageAsExitChatRoom(){return mDeleteMessagesAsExitChatRoom;}
    
private:
    EMChatConfigs(const EMChatConfigs&);
    EMChatConfigs& operator=(const EMChatConfigs&);
    
    std::string mResourcePath;
    std::string mWorkPath;
    std::string mLogPath;
    std::string mDownloadPath;
    std::string mAppKey;
    unsigned int mDeviceID;
    OSType mOs;
    std::string mOsVersion;
    std::string mSdkVersion;
    std::string mClientResource;
    EMChatPrivateConfigs *mPrivateConfigs;

    bool mEnableConsoleLog;
    bool mIsSandboxMode;
    bool mAutoAcceptFriend;
    bool mAutoAcceptGroup;
    bool mRequireReadAck;
    bool mRequireDeliveryAck;
    bool mRequireServerAck;
    bool mAutoConversationsLoaded;
    bool mDeleteMessagesAsExitGroup;
    bool mIsChatroomOwnerLeaveAllowed;
    bool mIsUsingHttps;
    int  mNumOfMessageLoaded;
    bool mUseEncryption;
    bool mDeleteMessagesAsExitChatRoom;
    bool mSortByServerTime;
    EMNetCallbackPtr mNetCallback;
};

typedef std::shared_ptr<EMChatConfigs> EMChatConfigsPtr;
	
} // namespace easemob


#endif /* emchatconfigs_h */
