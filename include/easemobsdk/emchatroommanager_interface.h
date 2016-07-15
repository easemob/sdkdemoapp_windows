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

#ifndef __easemob__emchatroommanager_interface__
#define __easemob__emchatroommanager_interface__

#include "emchatroommanager_listener.h"
#include "emchatroom.h"
#include "emerror.h"
#include "emcursorresult.h"

#include <vector>

namespace easemob
{

typedef std::vector<EMChatroomPtr> EMChatroomList;

class EASEMOB_API EMChatroomManagerInterface
{
public:
    virtual ~EMChatroomManagerInterface() {};
    
    /**
      * \brief Add a listener to chatroom manager.
      *
      * @param  A chatroom manager listener.
      * @return NA
      */
    virtual void addListener(EMChatroomManagerListener*) = 0;
    
    /**
      * \brief Remove a listener.
      *
      * @param  A chatroom manager listener.
      * @return NA
      */
    virtual void removeListener(EMChatroomManagerListener*) = 0;
    
    /**
      * \brief Remove all the listeners.
      *
      * @param  NA
      * @return NA
      */
    virtual void clearListeners() = 0;
    
    /**
      * \brief Get a chatroom with chatroomId, create the chatroom if not exist.
      *
      * @param  Chatroom's id.
      * @return A chatroom with the chatroomId.
      */
    virtual EMChatroomPtr chatroomWithId(const std::string &chatroomId) = 0;
    
    /**
      * \brief Fetch app's chatrooms.
      *
      * @param  EMError used for output.
      * @return Chatroom list.
      */
    virtual EMChatroomList fetchAllChatrooms(
        EMError &error) = 0;
    
    /**
      * \brief Get chatroom's specification.
      *
      * @param  Chatroom's ID.
      * @param  EMError used for output.
      * @param  Wether fetch chatroom's members.
      * @return The chatroom that update it's specification.
      */
    virtual EMChatroomPtr fetchChatroomSpecification(
        const std::string &chatroomId,
        EMError &error,
        bool fetchMembers = false
        ) = 0;
    
    /**
      * \brief Join a chatroom.
      *
      * @param  Chatroom's ID.
      * @param  EMError used for output.
      * @return The joined chatroom.
      */
    virtual EMChatroomPtr joinChatroom(
        const std::string &chatroomId,
        EMError &error
        ) = 0;
    
    /**
      * \brief Leave a chatroom.
      *
      * @param  Chatroom's ID.
      * @param  EMError used for output.
      * @return The leaved chatroom.
      */
    virtual EMChatroomPtr leaveChatroom(
        const std::string &chatroomId,
        EMError &error
        ) = 0;
    
    /**
      * \brief fetch chatroom with cursor
      * Note: User can input empty string as cursor at the first time. 
      *
      * @param Page's cursor.
      * @param  Page's size.
      * @param  EMError used for output.
      * @return Wrapper of next page's cursor and current page result.
      */
    virtual EMCursorResult fetchChatroomsWithCursor(
        const std::string &cursor,
        int pageSize,
        EMError &error) = 0;
    
    
    /**
     * \brief Get the chatroom by chatroom id
     *
     * @param chatroomId chat room ID
     * @return the chat room
     */
    virtual EMChatroomPtr joinedChatroomById(const std::string &chatroomId) = 0;
};
}

#endif /* defined(__easemob__emchatroommanager_interface__) */
