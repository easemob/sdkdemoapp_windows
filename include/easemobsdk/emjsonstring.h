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
//  emjsonstring.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef emjsonstring_h
#define emjsonstring_h

#include <string>
#include "emdefines.h"

namespace easemob {

class EASEMOB_API EMJsonString : public std::string
{
public:
    EMJsonString();
    EMJsonString(const std::string&);
    EMJsonString(const EMJsonString&);
    EMJsonString& operator=(const EMJsonString&);
    EMJsonString& operator=(const std::string&);
    EMJsonString& operator=(const char* right);
    const std::string& get() const;
    virtual ~EMJsonString();
};

}

#endif /* emjsonstring_h */
