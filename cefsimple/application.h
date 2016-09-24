#ifndef _APPLICATION_HYPHENATE_UIDEMO
#define _APPLICATION_HYPHENATE_UIDEMO

#include <emclient.h>
#include <sstream>
#include "simple_handler.h"
#include <mutex>

extern easemob::EMClient *g_client;

class Utils{
public:
	static void CallJS(const std::stringstream & stream);
	static bool g_bRosterDownloaded;
	static std::mutex roster_mutex; //lock of g_bRosterDownloaded
	static bool g_bGroupListDownloaded;
	static std::mutex group_mutex; //lock of g_bGroupListDownloaded
};

#endif