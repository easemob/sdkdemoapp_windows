#pragma once
#include <emcontactmanager_interface.h>
#include <emcontactlistener.h>

using namespace easemob;
using namespace std;

class ContactListener : public EMContactListener {
public:
	ContactListener() {
	}
	virtual void onContactAdded(const std::string &username);
	virtual void onContactDeleted(const std::string &username);
	virtual void onContactInvited(const std::string &username, std::string &reason);
	virtual void onContactAgreed(const std::string &username);
	virtual void onContactRefused(const std::string &username);
};