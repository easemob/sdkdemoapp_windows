#include "ContactListener.h"
#include "application.h"

void ContactListener::onContactAdded(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"from\",name : \"";
	stream << username;
	stream << "\"}');";
	Utils::CallJS(stream);
}

void ContactListener::onContactDeleted(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"none\",name : \"";
	stream << username;
	stream << "\"}');";
	Utils::CallJS(stream);
}

void ContactListener::onContactInvited(const std::string &username, std::string &reason)
{
	std::stringstream stream;
	stream << "Demo.conn.onPresence('{type: \"subscribe\",from : \"";
	stream << username;
	stream << "\", status : \"";
	stream << reason;
	stream << "\"}');";
	Utils::CallJS(stream);
}

void ContactListener::onContactAgreed(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"both\",name : \"";
	stream << username;
	stream << "\"}');";
	Utils::CallJS(stream);
}

void ContactListener::onContactRefused(const std::string &username)
{
}