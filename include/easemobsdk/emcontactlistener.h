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
//  emcontactlistener.h
//  easemob
//
//  Created by linan on 15/7/9.
//
//

#ifndef easemob_emcontactlistener_h
#define easemob_emcontactlistener_h

#include <memory>
#include <list>
#include "emdefines.h"

namespace easemob {
    /**
     * \class easemob contact listener
     */
    class EASEMOB_API EMContactListener {
    public:
        /**
         * \brief callback function called when contact added.
         *
         * @param  username newly added contact name.
         */
        virtual void onContactAdded(const std::string &username) = 0;
        
        /**
         * \brief called when contact deleted
         *
         * @param  usernames newly deleted contact name list.
         */
        virtual void onContactDeleted(const std::string &username) = 0;
        
        /**
         * \brief  called when user be invited by contact to be friend.
         *
         * @param  username contact when invited.
         * @param  message contact sent, telling invitation reason.
         */
        virtual void onContactInvited(const std::string &username, std::string &reason) = 0;
        
        /**
         * \brief  called when user invite contact to be friend, and contact has accepted the invitation.
         *
         * @param  username contact whom accept invitation.
         */
        virtual void onContactAgreed(const std::string &username) = 0;
        
        /**
         * \brief  called when user invite contact to be friend, and contact has declined the invitation.
         *
         * @param  username contact whom refused the invitation.
         */
        virtual void onContactRefused(const std::string &username) = 0;
    };
}

#endif
