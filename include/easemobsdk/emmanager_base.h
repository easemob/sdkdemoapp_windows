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
//  emmanager_base.h
//  easemob
//
//  Created by linan on 15/7/21.
//
//

#ifndef easemob_emmanager_base_h
#define easemob_emmanager_base_h

class EMManagerBase {
public:
    virtual void onInit() {}
    virtual void onDestroy() {};
};

#endif
