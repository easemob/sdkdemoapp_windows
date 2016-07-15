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
//  EMLocationMessageBody.h
//
//  Copyright (c) 2015年 EaseMob Inc. All rights reserved.
//

#ifndef __easemob__EMLocationMessageBody__
#define __easemob__EMLocationMessageBody__

#include <string>
#include "emmessagebody.h"

namespace easemob {

class EASEMOB_API EMLocationMessageBody : public EMMessageBody
{
public:

    #define INVALID_LAT_LONG -999.0

    /**
      * \brief Location message body constructor.
      *
      * @param  Latitude.
      * @param  Longitude.
      * @param  The address.
      * @return NA
      */
    EMLocationMessageBody(const double &latitude, const double &longitude, const std::string &address = "");
    
    /**
      * \brief Class destructor.
      *
      * @param  NA
      * @return NA
      */
    virtual ~EMLocationMessageBody(){}
    
    /**
      * \brief Get latitude.
      *
      * @param  NA
      * @return The latitude.
      */
    double latitude() const;
    
    /**
      * \brief Get longitude.
      *
      * @param  NA
      * @return The longitude.
      */
    double longitude() const;
    
    /**
      * \brief Get address.
      *
      * @param  NA
      * @return The address.
      */
    const std::string& address() const;
    
    /**
     * \brief Set latitude.
     *
     * @param latitude
     * @return NA
     */
    void setLatitude(double);
    
    /**
     * \brief Set longitude.
     *
     * @param longitude
     * @return NA
     */
    void setLongitude(double);
    
    /**
     * \brief Set address.
     *
     * @param address
     * @return NA
     */
    void setAddress(const std::string &);
    
private:
    /**
      * \brief Class initializer.
      *
      * @param  NA
      * @return NA
      */
    void init();
    
    /**
      * \brief Private location message body constructor.
      *
      * @param  NA
      * @return NA
      */
    EMLocationMessageBody();
    
private:
    EMLocationMessageBody(const EMLocationMessageBody&);
    EMLocationMessageBody& operator=(const EMLocationMessageBody&);
    virtual void dummy() const{}
    double mLatitude;
    double mLongitude;
    std::string mAddress;
    friend class EMMessageEncoder;
    friend class EMLocationMessageBodyPrivate;
};

typedef std::shared_ptr<EMLocationMessageBody> EMLocationMessageBodyPtr;

}

#endif /* defined(__easemob__EMLocationMessageBody__) */
