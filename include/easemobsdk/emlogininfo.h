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

#ifndef __easemob__emlogininfo__
#define __easemob__emlogininfo__

#include <string>

namespace easemob
{
class EASEMOB_API EMLoginInfo
{
public:
    virtual ~EMLoginInfo() {}
    virtual const std::string& loginUser() const = 0;
    virtual const std::string& loginPassword() const = 0;
    virtual const std::string& loginToken() const = 0;
};
}

#endif /* defined(__easemob__emlogininfo__) */
