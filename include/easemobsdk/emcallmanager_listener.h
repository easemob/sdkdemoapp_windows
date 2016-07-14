//
//  emcallmanager_listener.h
//  easemob
//
//  Created by dhc on 15/8/12.
//
//

#ifndef easemob_emcallmanager_listener_h
#define easemob_emcallmanager_listener_h

#include "emerror.h"
#include "emcallsession.h"

namespace easemob{
class EASEMOB_API EMCallManagerListener
{
public:
    
    /**
     * \brief Constructor.
     *
     * @param  NA
     * @return NA
     */
    EMCallManagerListener() {}
    
    /**
     * \brief Destructor.
     *
     * @param  NA
     * @return NA
     */
    virtual ~EMCallManagerListener() {}
    
    //有电话打进来
    virtual void onReceiveCallIncoming(const EMCallSessionPtr session) = 0;
    
    //电话通道已建立
    virtual void onReceiveCallConnected(const EMCallSessionPtr session) = 0;
    
    //电话已接通
    virtual void onReceiveCallAccepted(const EMCallSessionPtr session) = 0;
    
    //电话已挂断
    virtual void onReceiveCallTerminated(const EMCallSessionPtr session, EMCallSession::EndReason reason, const EMErrorPtr error) = 0;
    
    //电话信息有更新
    virtual void onReceiveCallUpdated(const EMCallSessionPtr session, EMCallSession::StreamControlType controlType) = 0;
    
    //不对用户开放，平台sdk封装使用
    //setup voice transport
    //返回0为成功，其他为失败
    virtual int onReceiveSetupCallVoiceTransport(const std::string& transportId, bool isRelay, int localPort, const std::string& localIp, int remotePort, const std::string& remoteIp, int remoteChannelId, const std::string& remoteRcode) = 0;
    //setup video transport
    virtual void onReceiveSetupCallVideoTransport(const std::string& transportId, bool isRelay, int localPort, const std::string& localIp, int remotePort, const std::string& remoteIp, int remoteChannelId, const std::string& remoteRcode) = 0;
    
    virtual void onReceiveStopCallTransport(const std::string& stopId) = 0;
    
private:
    
};
}


#endif
