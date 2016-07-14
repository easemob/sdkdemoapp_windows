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

#ifndef __easemob__emnetwork_listener__
#define __easemob__emnetwork_listener__

namespace easemob
{

class EASEMOB_API EMNetworkListener
{
public:
    typedef enum
    {
        NONE, CABLE, WIFI, MOBILE
    }EMNetworkType;    

    virtual ~EMNetworkListener() {}
    virtual void onNetworkChanged(EMNetworkType to) = 0;
};

}

#endif /* defined(__emnetworkconnection_listener__) */
