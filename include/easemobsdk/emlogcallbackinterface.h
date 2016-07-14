//
//  emlogcallbackinterface.h
//  easemob
//
//  Created by youni on 15/12/3.
//
//

#ifndef emlogcallbackinterface_h
#define emlogcallbackinterface_h

#include <string>

namespace easemob{
    
// add a simple log callback interface for platform sdk
class EMLogCallbackInterface{
public:
    virtual ~EMLogCallbackInterface(){}
    virtual void onLogCallback(const std::string &aLogString) = 0;
};

}

#endif /* emlogcallbackinterface_h */
