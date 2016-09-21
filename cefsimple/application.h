#ifndef _APPLICATION_HYPHENATE_UIDEMO
#define _APPLICATION_HYPHENATE_UIDEMO

#include <emclient.h>
#include <sstream>
#include "simple_handler.h"

extern easemob::EMClient *g_client;

class Utils{
public:
	static void CallJS(const std::stringstream & stream);
};

#endif