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
#ifndef EMCORE_CONFIGMANAGER_H
#define EMCORE_CONFIGMANAGER_H

#include <string>
#include <memory>
#include <map>
#include <mutex>
#include "emmanager_base.h"
#include "emchatconfigs.h"
#include "emdatabase.h"
#include "emerror.h"
#include "emlogininfo.h"
#include "utils/emutils.h"
#include "emdnsmanager.h"

namespace easemob {

class EMAttributeValue;

using std::string;
using std::mutex;
using std::map;
using easemob::EMAttributeValue;

static const std::string CONFIG_FILE = "config.json";

static const std::string  MSYNC_VERSION = "3.1.1";

static const std::string  STUN_SERVER = "121.41.105.183";
static const int          STUN_SERVER_PORT = 3478;

static const std::string  DEFAULT_RESOURCE = "mobile";
static const std::string  DEFAULT_CHATDOMAIN = "easemob.com";
static const std::string  DEFAULT_GROUPDOMAIN = "conference.easemob.com";

static const int DEFAULT_OS_TYPE = 2; //statistics.hpp->OsType

class EMConfigManager : public EMManagerBase {
public:

    struct LoginInfo : public EMLoginInfo
    {
        std::string mUserName;
        std::string mPassword;
        std::string mToken;
        int64_t mSavedTime;
    
        virtual const std::string& loginUser() const
        {
            return mUserName;
        }
        
        virtual const std::string& loginPassword() const
        {
            return mPassword;
        }
        
        virtual const std::string& loginToken() const
        {
            return mToken;
        }
    };

    EMConfigManager(EMDatabasePtr database, EMPathUtilPtr util);
    virtual ~EMConfigManager();

    void init(const EMChatConfigsPtr configs);
    void updateChatConfigs(const EMChatConfigsPtr configs);
    EMChatConfigsPtr getChatConfigs();
    /*!
     @brief
     Supported types: bool, int, int64_t, double, string.
     */
    template<typename T>
    void setConfig(const std::string &key, const T &value);

    /*!
     @brief
     Supported types: bool, int, int64_t, double and string.
     */
    template<typename T>
    bool getConfig(const std::string &key, T &value);

    void removeConfig(const std::string &key);
    void clearConfigs();
    void saveConfigs();
    
    LoginInfo& loginInfo();
    void clearLoginInfo();
    const std::string& resourcePath() const;
    const std::string& workPath() const;
    const std::string& appKey() const;
    std::string restBaseUrl(bool withAppkey = true, bool nextHost = false);
    const std::string& userName() const;
    const std::string& password() const;
    EMError::EMErrorCode fetchToken(const std::string &username, const std::string &password);
    const std::string& token(bool fetchFromServer = false);
    EMErrorPtr token(std::string& token, bool fetchFromServer = false);
    std::string restToken(bool fetchFromServer = false);
    bool sandbox() const;

    const std::string sdkVersion() const;
    const std::string clientResource() const;
    const std::string chatDomain() const;
    const std::string groupDomain() const;

    virtual void onDestroy();

    EMPathUtilPtr getPathUtil() { return mPathUtil; };
    EMDNSManagerPtr getDnsManager() { return mDnsManager; }
private:
    EMMap<std::string, std::shared_ptr<EMAttributeValue> > mConfig;
    LoginInfo mLoginInfo;
    EMChatConfigsPtr mChatConfigs;
    EMDatabasePtr mDatabase;
    EMPathUtilPtr mPathUtil;
    EMDNSManagerPtr mDnsManager;
    
    EMError::EMErrorCode fetchTokenForUser(const std::string &user, const std::string &password, std::string &token);
    void DumpConfig();
};

}

#endif

