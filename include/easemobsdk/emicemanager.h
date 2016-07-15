//
//  emicemanager.h
//  easemob
//
//  Created by dhc on 15/8/18.
//
//

#ifndef __easemob__emicemanager__
#define __easemob__emicemanager__

#include <stdio.h>
#include <string>
#include <vector>
#include <map>

#include "conference.hpp"
#include "rapidjson/document.h"
#include "emcallsession.h"
#include "emticket.h"
#include "utils/emlog.h"

extern "C"  {
#include "eice.h"
}

static const std::string KEY_LOCALSDP_CONTENT = "content";
static const std::string KEY_LOCALSDP_CONFERENCEID = "conferenceId";

namespace easemob {
    
class EMIceManager{
public:
    
    typedef enum
    {
        Uninitialized = 0,
        Initialized,
        Negotiating,
        Negotiated,
        Destroying,
    } EMIceStatus;
    
    EMIceManager(const std::string& ip, int port);
    
    virtual ~EMIceManager();
    
    EMIceStatus status();
    void setStatus(EMIceManager::EMIceStatus status);
    
    void setTurnIpPort(const std::string& ip, int port);
    
    std::map<std::string, std::string> getCallerLocalSDP(int compCount, const std::string& jsonContent);
    
    std::string getCalleeLocalSDP(int compCount, const std::string& callerContent);
    
    std::vector<EMTicketPair*> callerNegotiate(int compCount, const std::string& calleeContent, EMCallSession::ConnectType& connectType);
    
    std::vector<EMTicketPair*> calleeNegotiate(EMCallSession::ConnectType& connectType);
    
    bool destroyIce();
    
private:
    std::recursive_mutex mMutex;
    eice_t mIce;
    EMIceStatus mStatus;
    std::string mIp;
    int mPort;
    
    bool createIce();
    
    std::string getNegoString();
    
    std::map<std::string, std::string> getCallerJsonContent(int compCount, const std::string& content);
    
    EMTicket* ticketWithObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &jsonobject);
    EMTicketPair* negoTicketPairWithObject(const rapidjson::GenericValue<rapidjson::UTF8<>> &jsonobject, EMCallSession::ConnectType connectType);
    std::vector<EMTicketPair*> negotiateResultWithJsonString(const char* resultContent, EMCallSession::ConnectType& connectType);
};
    
}


#endif /* defined(__easemob__emice__) */
