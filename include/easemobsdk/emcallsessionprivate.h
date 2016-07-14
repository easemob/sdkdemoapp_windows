//
//  emcallsessionprivate.h
//  ioseasemob
//
//  Created by XieYajie on 1/19/16.
//
//

#ifndef emcallsessionprivate_h
#define emcallsessionprivate_h

#include <string>
#include <mutex>
#include <stdlib.h>

#include "emcallsession.h"
#include "emticket.h"

namespace easemob
{
    
class EMTicketPair;

class EMCallSessionPrivate {
public:
    EMCallSessionPrivate();
    virtual ~EMCallSessionPrivate();
    
    const std::string& conferenceId() const;
    void setConferenceId(const std::string& conferenceId);
    
    EMCallSession::ConnectType connectType() const;
    void setConnectType(EMCallSession::ConnectType);
    
    EMCallSession::Status status() const;
    void setStatus(EMCallSession::Status);
    
    void addNegoTicketPair(EMTicketPair* ticketpair, uint64_t type);
    
    EMTicketPair* mUsingVoiceTicket;
    EMTicketPair* mUsingVideoTicket;
    
    int64_t mStartTime;
    
private:
    std::recursive_mutex mMutex;
    std::string mConferenceId;
    EMCallSession::ConnectType mConnectType;
    EMCallSession::Status mStatus;
    
    EMCallSessionPrivate(const EMCallSessionPrivate&);
    EMCallSessionPrivate& operator=(const EMCallSessionPrivate&);
};
    
}

#endif /* emcallsessionprivate_h */
