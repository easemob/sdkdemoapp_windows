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
//  EMMessagePayloadDefs.h
//  easemob
//
//  Created by Neil Cao on 15/6/26.
//
//

#ifndef easemob_EMMessagePayloadDefs_h
#define easemob_EMMessagePayloadDefs_h

#include <string>

namespace easemob {

// message keys
static const std::string ATTR_TO = "to";
static const std::string ATTR_FROM = "from";
static const std::string ATTR_BODIES = "bodies";
static const std::string ATTR_EXT = "ext";

// text
static const std::string ATTR_MSG = "msg";

// file
static const std::string ATTR_URL = "url";
static const std::string ATTR_SECRET = "secret";
static const std::string ATTR_FILENAME = "filename";
static const std::string ATTR_FILELEN = "file_length";
static const std::string ATTR_LOCALPATH = "localPath";
static const std::string ATTR_ATTACHMENTDOWNLOADSTATUS = "attachmentDownloadStatus";

// location
static const std::string ATTR_LAT = "lat";
static const std::string ATTR_LNG = "lng";
static const std::string ATTR_ADDR = "addr";

// image
static const std::string ATTR_SIZE = "size";
static const std::string ATTR_SIZE_WIDTH = "width";
static const std::string ATTR_SIZE_HEIGHT = "height";
static const std::string ATTR_THUMB_REMOTE = "thumb";
static const std::string ATTR_THUMB_SECRET = "thumb_secret";
static const std::string ATTR_THUMB_LOCALPATH = "thumbLocalPath";
static const std::string ATTR_THUMB_SIZE = "thumbSize";
static const std::string ATTR_THUMB_SIZE_WIDTH = "thumbWidth";
static const std::string ATTR_THUMB_SIZE_HEIGHT = "thumbHeight";
static const std::string ATTR_THUMB_DOWNLOADSTATUS = "thumbnailDownloadStatus";
static const std::string ATTR_THUMB_FILELEN = "thumbFileLength";
static const std::string ATTR_THUMB_FILENAME = "thumbFilename";

// voice & video
static const std::string ATTR_DURATION = "length";

// command
static const std::string ATTR_ACTION = "action";
static const std::string ATTR_PARAMS = "param";

// message body keys
static const std::string ATTR_TYPE = "type";

// message types.
static const std::string ATTR_TYPE_TXT = "txt";
static const std::string ATTR_TYPE_IMG = "img";
static const std::string ATTR_TYPE_VOICE = "audio";
static const std::string ATTR_TYPE_LOCATION = "loc";
static const std::string ATTR_TYPE_VIDEO = "video";
static const std::string ATTR_TYPE_FILE = "file";
static const std::string ATTR_TYPE_COMMAND = "cmd";

}
#endif
