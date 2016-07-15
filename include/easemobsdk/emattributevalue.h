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
//  EMAttributeValue.h
//  easemob
//
//  Created by Neil Cao on 15/7/1.
//
//

#ifndef __easemob__EMAttributeValue__
#define __easemob__EMAttributeValue__

#include <string>
#include <memory>
#include "emjsonstring.h"
#include <vector>

namespace easemob {

class EMConfigManager;
class EMMessageEncoder;
class Connection;
class EMHttpRequest;
class EMAttributeValue
{
public:
    EMAttributeValue();
    EMAttributeValue(bool value);
    EMAttributeValue(char value);
    EMAttributeValue(unsigned char value);
    EMAttributeValue(short value);
    EMAttributeValue(unsigned short value);
    EMAttributeValue(int32_t value);
    EMAttributeValue(uint32_t value);
    EMAttributeValue(int64_t value);
    EMAttributeValue(uint64_t value);
    EMAttributeValue(float value);
    EMAttributeValue(double value);
    EMAttributeValue(const std::string& value);
    EMAttributeValue(const char* value);
    EMAttributeValue(const std::vector<std::string>& values);
    EMAttributeValue(const EMJsonString& value);
    EMAttributeValue(const EMAttributeValue& from);
    EMAttributeValue& operator=(const EMAttributeValue& right);
    
    template <typename T>
    bool is() const;
    
    template <typename T>
    bool isType() const
    {
        return is<T>();
    }
    
    template <typename T>
    T value() const;
    
    template<typename T>
    void setValue(const T &value);
    void setValue(const char* value);
    
    template <typename T>
    void operator=(const T& value)
    {
        setValue(value);
    }
    
    void operator=(const char* value)
    {
        setValue(value);
    }

    int type() const
    {
        return (int)mType;
    }
    
private:
    enum class EMAttributeValueType
    {
        BOOL,
        CHAR,
        UCHAR,
        SHORT,
        USHORT,
        INT32,
        UINT32,
        INT64,
        UINT64,
        FLOAT,
        DOUBLE,
        STRING,
        STRVECTOR,
        JSONSTRING,
        NULLOBJ
    };
    
    EMAttributeValue(const std::string& value, EMAttributeValueType type) : mValue(value), mType(type) {}
    bool write(void *writer);
    bool bind(void *stmt, int column);
    
    std::string mValue;
    EMAttributeValueType mType;
    std::vector<std::string> mValues;

    friend EMConfigManager;
    friend EMMessageEncoder;
    friend Connection;
    friend EMHttpRequest;
};

typedef std::shared_ptr<easemob::EMAttributeValue> EMAttributeValuePtr;

}

#endif /* defined(__easemob__EMAttributeValue__) */
