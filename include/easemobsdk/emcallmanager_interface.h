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
#ifndef EMCORE_CALL_MANAGER_INTERFACE_H
#define EMCORE_CALL_MANAGER_INTERFACE_H

#include <string>

#include "emcallmanager_listener.h"
#include "emcallsession.h"

namespace easemob {

class EASEMOB_API EMCallManagerInterface {
public:
    
    virtual ~EMCallManagerInterface() { };
    
    virtual EMCallSessionPtr makeCall(const std::string& remoteName, EMCallSession::Type type, EMError& error) = 0;
    
    virtual void answerCall(const std::string& sessionId, EMError& error) = 0;
    
    virtual void endCall(const std::string& sessionId, EMCallSession::EndReason reason) = 0;
    
    virtual bool updateCall(const std::string& sessionId, EMCallSession::StreamControlType controlType) = 0;
    
    virtual std::string getCallTransportId(const std::string& sessionId) = 0;
    
    virtual void addListener(EMCallManagerListener*) = 0;
    
    virtual void removeListener(EMCallManagerListener*) = 0;
    
    virtual void clearListeners() = 0;
};

}

#endif
