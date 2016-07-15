//
//  emcallsession.h
//  easemob
//
//  Created by dhc on 15/8/13.
//
//

#ifndef __easemob__emcallsession__
#define __easemob__emcallsession__

#include <stdio.h>
#include <string>
#include <mutex>
#include <memory>

#include "emdefines.h"

namespace easemob {
    
class EMCallManager;
class EMCallSessionPrivate;
    
class EASEMOB_API EMCallSession
{
public:
    
    typedef enum
    {
        VOICE = 0,  //voice call
        VIDEO,      //video call
    } Type;
    
    typedef enum
    {
        NONE = 0,   //Initial value
        DIRECT,     //direct
        RELAY,      //relay
    } ConnectType;
    
    typedef enum
    {
        DISCONNECTED    = 0,       //Disconnected, initial value
        RINGING,                   //Ringing
        //ANSWERING,               //Answering
        //PAUSING,                 //Pausing
        CONNECTING,                //Connecting
        CONNECTED,                 //Connected
        ACCEPTED,                  //Accepted
    } Status;
    
    typedef enum
    {
        HANGUP  = 0,    //hang up
        NORESPONSE,     //no response
        REJECT,         //reject
        BUSY,           //busy
        FAIL,           //fail
    } EndReason;
    
    typedef enum {
        PAUSE_VOICE,
        RESUME_VOICE,
        PAUSE_VIDEO,
        RESUME_VIDEO,
    } StreamControlType;
    
    EMCallSession(const std::string& sid, const std::string& localName, const std::string& remoteName, Type type, bool isCaller);
    virtual ~EMCallSession();
    
    const std::string& sessionId() const;
    const std::string& conferenceId() const;
    bool isCaller() const;
    const std::string& localName() const;
    const std::string& remoteName() const;
    Type type() const;
    ConnectType connectType() const;
    Status status() const;
    
    std::string getStopId();
    
    friend EMCallManager;
private:
    EMCallSessionPrivate *mPrivate;
    
    std::recursive_mutex mMutex;
    std::string mSessionId;
    std::string mLocalName;
    std::string mRemoteName;
    Type mType;
    bool mIsCaller;
    
    EMCallSession(const EMCallSession&);
    EMCallSession& operator=(const EMCallSession&);
};

typedef std::shared_ptr<EMCallSession> EMCallSessionPtr;
    
}

#endif /* defined(__easemob__emcallsession__) */
