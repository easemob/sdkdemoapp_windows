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

#ifndef __easemob__emchatroomprivate__
#define __easemob__emchatroomprivate__

#include <string>

#include "emgroupprivate.h"

namespace easemob
{
class EMChatroomPrivate : public EMGroupPrivate
{
public:
    EMChatroomPrivate(const std::string &id) :
        EMGroupPrivate(id, true)
    {}
};
}

#endif /* defined(__easemob__emchatroomprivate__) */
