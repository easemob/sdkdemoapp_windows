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
#ifndef _emmessageencoder_H
#define _emmessageencoder_H

#include <string>
#include <memory>

namespace easemob {
	    
class EMMessageBody;
class EMMessage;

class EMMessageEncoder{
public:
            
    static std::string encodeToJson(EMMessage& msg, bool encodeLocalPath = false);
        
    static std::shared_ptr<EMMessage> decodeFromJson(const std::string&);
};

}
#endif
