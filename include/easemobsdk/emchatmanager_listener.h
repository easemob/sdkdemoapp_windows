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
//  EMChatManagerListener.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMChatManagerListener__
#define __easemob__EMChatManagerListener__

#include "message/emmessage.h"
#include "emerror.h"
#include "emconversation.h"

#include <vector>

namespace easemob {

class EASEMOB_API EMChatManagerListener
{
public:
    /**
      * \brief Constructor.
      *
      * @param  NA
      * @return NA
      */
    EMChatManagerListener() {}
    
    /**
      * \brief Destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMChatManagerListener() {}
    
    
    /**
      * \brief Callback user when receive a list of messages from remote peer.
      *
      * @param  The received messages.
      * @return NA
      */
    virtual void onReceiveMessages(const EMMessageList &messages) {}
    
    /**
      * \brief Callback user when receive a list of command messages from remote peer.
      *
      * @param  The received command message.
      * @return NA
      */
    virtual void onReceiveCmdMessages(const EMMessageList &messages) {}
    
    /**
      * \brief Callback user when receive a message sending error from server.
      *
      * Note: User can receive this calback if send a message failed(e.g. message contain illegal speech, 
        or user don't have the permission).
      * @param  The message to send.
      * @param  The occured error.
      * @return NA
      */
    virtual void onReceiveError(const EMMessagePtr message, const EMErrorPtr error){}
    
    /**
      * \brief Callback user when send message successed or failed.
      *
      * Note: User will receive this callback only when not provide a message sending callback or callback returned false.
      * @param  The message to send.
      * @param  The occured error.
      * @return NA
      */
    virtual void onMessageStatusChanged(const EMMessagePtr message, const EMErrorPtr error){}
    
    /**
      * \brief Callback user when attachment download status changed.
      *
      * Note: User will receive this callback when thumbnail automatically download status changed or user download
        attachment and doesn't provide a callback.
      * @param  The message which's attachment is downloaded.
      * @param  The occured error.
      * @return NA
      */
    virtual void onMessageAttachmentsStatusChanged(const EMMessagePtr message, const EMErrorPtr error){}
    
    /**
      * \brief Callback user when receive read ack for messages.
      *
      * @param  The messages that receive read ack.
      * @return NA
      */
    virtual void onReceiveHasReadAcks(const EMMessageList &messages) {}
    
    /**
      * \brief Callback user when receive delivery successed ack for messages.
      *
      * @param  The messages that receive delivery ack.
      * @return NA
      */
    virtual void onReceiveHasDeliveredAcks(const EMMessageList &messages) {}
    
    /**
      * \brief Callback user when conversation list are changed.
      *
      * @param  The new conversation list.
      * @return NA
      */
    virtual void onUpdateConversationList(const EMConversationList &conversations) {}
};

}

#endif /* defined(__easemob__EMChatManagerListener__) */
