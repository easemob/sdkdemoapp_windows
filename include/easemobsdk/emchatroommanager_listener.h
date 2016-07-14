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

#ifndef __easemob__emchatroommanager_listener__
#define __easemob__emchatroommanager_listener__

#include "emchatroom.h"

#include <string>

namespace easemob {

class EASEMOB_API EMChatroomManagerListener
{
public:
    /**
      * \brief Callback user when user is kicked out from a chatroom or the chatroom is destroyed.
      *
      * @param  The chatroom that user left.
      * @param  The leave reason.
      * @return NA
      */
    virtual void onLeaveChatroom(const EMChatroomPtr chatroom, EMChatroom::EMChatroomLeaveReason reason) {}
    
    /**
      * \brief Callback user when a user join the chatroom.
      *
      * @param  The chatroom that user joined.
      * @param  The member.
      * @return NA
      */
    virtual void onMemberJoinedChatroom(const EMChatroomPtr chatroom, const std::string &member) {};
    
    /**
      * \brief Callback user when a user leave the chatroom.
      *
      * @param  The chatroom that user left.
      * @param  The member.
      * @return NA
      */
    virtual void onMemberLeftChatroom(const EMChatroomPtr chatroom, const std::string &member) {};
    
};

}

#endif /* defined(__easemob__emchatroommanager_listener__) */
