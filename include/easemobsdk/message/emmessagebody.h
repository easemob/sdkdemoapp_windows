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
//  EMMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMMessageBody__
#define __easemob__EMMessageBody__

#include <string>
#include <memory>
#include <vector>

#include "embaseobject.h"

namespace easemob {

class EMMessageBodyPrivate;
    
class EASEMOB_API EMMessageBody : public EMBaseObject
{
public:

    typedef enum
    {
        TEXT,       //Text message body
        IMAGE,      //Image message body
        VIDEO,      //Video message body
        LOCATION,   //Location message body
        VOICE,      //Voice message body
        FILE,       //File message body
        COMMAND     //Command message body
    } EMMessageBodyType;

    /**
      * \brief Message body constructor.
      *
      * @param  The message body type.
      * @return NA
      */
    EMMessageBody(EMMessageBodyType = TEXT);
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMMessageBody();
    
    /**
      * \brief Get message body type.
      *
      * @param  NA
      * @return The message body type.
      */
    EMMessageBodyType type() const { return mType; };

protected:
    /**
      * \brief It's a dummy method.
      *
      * @param  NA
      * @return NA.
      */
    virtual void dummy() const = 0;

protected:
    EMMessageBodyPrivate* mBodyPrivate;
    
protected:
    EMMessageBodyType mType;

private:
    EMMessageBody(const EMMessageBody&);
    EMMessageBody& operator=(const EMMessageBody&);
    friend class EMMessage;
    friend class EMMessageBodyPrivate;
    friend class EMMessageEncoder;
};

typedef std::shared_ptr<EMMessageBody> EMMessageBodyPtr;

}

#endif /* defined(__easemob__EMMessageBody__) */
