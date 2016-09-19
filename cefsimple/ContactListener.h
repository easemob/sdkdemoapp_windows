#pragma once
#include <emcontactmanager_interface.h>
#include <emcontactlistener.h>

#include "simple_handler.h"
#include <sstream>
#include "atlstr.h"

using namespace easemob;
using namespace std;

class ContactListener : public EMContactListener {
public:
	ContactListener() {
	}
	void CallJS(const std::stringstream & stream);
	virtual void onContactAdded(const std::string &username);
	virtual void onContactDeleted(const std::string &username);
	virtual void onContactInvited(const std::string &username, std::string &reason);
	virtual void onContactAgreed(const std::string &username);
	virtual void onContactRefused(const std::string &username);
};