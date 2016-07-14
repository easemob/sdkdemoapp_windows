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
#ifndef EASEMOB_SQLITE_H_
#define EASEMOB_SQLITE_H_


#include <sqlite3.h>

#include <map>
#include <memory>
#include <string>
#include <functional>

#include "emattributevalue.h"
#include "emstl.h"

namespace easemob {

class Connection;

/**
 * SELECT statment result container, with autoconversion to correct types
 */
class Column {
public:
    Column(sqlite3_stmt *stmt, int index) : stmt_(stmt), index_(index) {}
    const char *GetText() const;
    int GetInt() const;
    sqlite3_int64 GetInt64() const;
    operator int() const;
    operator sqlite3_int64() const;
    operator const char*() const;
    operator std::string() const;
    
private:
    sqlite3_stmt *stmt_;
    int index_;
};

/**
 * Wrapper around sqlite statements
 */
class Statement {
public:
    Statement(sqlite3 *db, sqlite3_stmt *stmt);
    virtual ~Statement();

    int Step();

    Column GetColumn(int index);
    Column GetColumn(const std::string &columnName);

    void Bind(int index, const std::string &value);
    void Bind(int index, int value);
    void Bind(int index, sqlite3_int64 value);
    void BindNull(int index);

private:
    Statement(const Statement&);
    Statement& operator=(const Statement&);
    std::map<std::string, int> *columnIndexMap();
    
    sqlite3 *db_;
    sqlite3_stmt *stmt_;
    std::map<std::string, int> *mColumnIndexMap;
};
typedef std::shared_ptr<Statement> StatementPtr;

/**
 * Wrapper around a sqlite database connection
 */
class Connection {
public:
    Connection();
    bool open(const std::string &db);
    virtual ~Connection();

    StatementPtr MakeStmt(const std::string sql) {
        return MakeStmt(sql, std::vector<easemob::EMAttributeValue>());
    }
    StatementPtr MakeStmt(const std::string &sql, const std::vector<easemob::EMAttributeValue> &values);
    int StepSql(const std::string sql) {
        return StepSql(sql, std::vector<easemob::EMAttributeValue>());
    }
    int StepSql(const std::string &sql, const std::vector<easemob::EMAttributeValue> &values);

    void ExecuteSql(std::function<void(Connection&)>);
    sqlite3_int64 GetLastInsertId();

private: 
    Connection(const Connection&);
    Connection& operator=(const Connection&);
    sqlite3 *db_;
};

} // namespace sqlite

#endif // EASEMOB_SQLITE_H_
