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
#ifndef EMCORE_DNSMANAGER_H
#define EMCORE_DNSMANAGER_H

#include <memory>
#include <string>
#include <mutex>
#include "emerror.h"
#include "emstl.h"

namespace easemob {
class EMConfigManager;

class EMDNSManager {
public:
    typedef struct Host{
        std::string domain;
        std::string ip;
        int         port;
        std::string protocol;

        Host() {
            domain = "";
            ip = "";
            port = -1;
            protocol = "";
        }
        const std::string& getAddress() const {
            if(!ip.empty()) {
                return ip;
            } else {
                return domain;
            }
        }
        std::string getProtocol() const {
            if(!ip.empty() && protocol == "https") {
                return "http";
            } else {
                return protocol;
            }
        }
    } EMHost;

    typedef struct DNSConfig{
        std::string name;
        std::string version;
        int64_t validBefore;
        EMVector<EMHost> resolverServers;
        EMVector<EMHost> imServers;
        EMVector<EMHost> restServers;

        DNSConfig() { validBefore = -1; version = "1";}
        void reset();
    } EMDNSConfig;

    typedef enum {RESOLVER, IM, REST } EMHostType;

    EMDNSManager(EMConfigManager *configManager);
    virtual ~EMDNSManager();

    EMErrorPtr getCurrentHost(EMHostType type, EMHost &host);
    EMErrorPtr getNextAvailableHost(EMHostType type, EMHost &host);

    void clearDnsConfig();
    std::string compress2GZfile(const std::string&);
    
    EMErrorPtr getDnsListFromServer();
    bool isEnabledGCM();
    void setUseAws(bool useAws);
private:
    EMDNSManager(EMDNSManager const&);
    void operator=(EMDNSManager const&);

    EMErrorPtr parseDnsServer(const std::string& dns, bool fromLocalPath);

    EMErrorPtr getPrivateHost(EMHostType type, EMHost &host);
    EMErrorPtr getHost(EMHostType type, EMHost &host);
    void checkDNS();
    std::string url_encode(const std::string &value);
    std::string buildUrl(bool nextHost = false);
    void randomOffer();
    void randomServers(EMVector<EMHost> &servers);
#if defined( __APPLE__)
    bool isIPV4(const std::string& address);
#endif
    void convertToIPv6(EMHost &host);

    EMConfigManager *mConfigManager;
    
    EMDNSConfig mDNSConfig;
    bool mEnableGCM;

    int mResolverIndex;
    int mImIndex;
    int mRestIndex;
    
    std::string mDnsFilePath;

    static std::recursive_mutex g_mutex; 
};
typedef std::shared_ptr<EMDNSManager> EMDNSManagerPtr;

} //namespace easemob
#endif // EMCORE_DNSMANAGER_H
