//
//  emconnectionlistener.h
//  easemob
//
//  Created by zhaoliang on 11/18/15.
//
//

#ifndef easemob_emconnectionlistener_h
#define easemob_emconnectionlistener_h

#include "emerror.h"
#include <memory>

namespace easemob {

class EASEMOB_API EMConnectionListener
{
public:
    virtual ~EMConnectionListener() {}
    
    virtual void onConnect() = 0;
    virtual void onDisconnect(EMErrorPtr error) = 0;
    virtual void onPong() { } // receive Pong(PingPong) from server, apps can ignore this
};

typedef std::shared_ptr<EMConnectionListener> EMConnectionListenerPtr;

}

#endif
