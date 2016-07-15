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
//  EMBaseObject.h
//  easemob
//
//  Created by Neil Cao on 15/7/2.
//
//

#ifndef __easemob__EMBaseObject__
#define __easemob__EMBaseObject__

#include <memory>
#include "emdefines.h"

namespace easemob
{
    class EASEMOB_API EMBaseObject
    {
    public:
        virtual ~EMBaseObject() {}
        
        template <typename T>
        T* cast() { return static_cast<T*>(this); }
    };
    
    typedef std::shared_ptr<EMBaseObject> EMBaseObjectPtr;
    
}


#endif /* defined(__easemob__EMBaseObject__) */
