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
//  EMVoiceMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMVoiceMessageBody__
#define __easemob__EMVoiceMessageBody__

#include <string>
#include <vector>
#include "emfilemessagebody.h"

namespace easemob {

class EASEMOB_API EMVoiceMessageBody : public EMFileMessageBody
{
public:
    /**
      * \brief Voice message body constructor.
      *
      * @param  NA
      * @return NA
      */
    EMVoiceMessageBody();
    
    /**
      * \brief Voice message body constructor.
      *
      * @param  Voice attachment local path.
      * @param  Voice playing duration.
      * @return NA
      */
    EMVoiceMessageBody(const std::string &localPath, int duration);
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMVoiceMessageBody();
    
    /**
      * \brief Get voice playing duration.
      *
      * @param  NA
      * @return The voice playing duration.
      */
    int duration() const;
    
    /**
      * \brief Set voice playing duration.
      *
      * @param  The voice playing duration.
      * @return NA
      */
    void setDuration(int);
    
private:
    /**
      * \brief Class initializer.
      *
      * @param  NA
      * @return NA
      */
    void init();
    
private:
    EMVoiceMessageBody(const EMVoiceMessageBody&);
    EMVoiceMessageBody& operator=(const EMVoiceMessageBody&);
    
    int mDuration;
};
typedef std::shared_ptr<EMVoiceMessageBody> EMVoiceMessageBodyPtr;
}


#endif /* defined(__easemob__EMVoiceMessageBody__) */
