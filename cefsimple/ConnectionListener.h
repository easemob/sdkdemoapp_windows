#pragma once

#include <emclient.h>

using namespace easemob;
using namespace std;

class ConnectionListener : public EMConnectionListener {
public:
	ConnectionListener()
	{
	}

	virtual void onDisconnect(EMErrorPtr error);
	virtual void onConnect();
};

