#include "ContactListener.h"

void ContactListener::CallJS(const std::stringstream & stream)
{
	std::string strJSCall = stream.str();
	SimpleHandler *sh = SimpleHandler::GetInstance();
	if (sh != NULL)
	{
		CefRefPtr<CefBrowser> browser = sh->GetBrowser();
		if (browser.get())
		{
			CefRefPtr<CefFrame> frame = browser->GetMainFrame();
			if (frame.get())
			{
				frame->ExecuteJavaScript(strJSCall.c_str(), L"", 0);
			}
		}
	}
}
void ContactListener::onContactAdded(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"from\",name : \"";
	stream << username;
	stream << "\"}');";
	CallJS(stream);
}
void ContactListener::onContactDeleted(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"none\",name : \"";
	stream << username;
	stream << "\"}');";
	CallJS(stream);
}
void ContactListener::onContactInvited(const std::string &username, std::string &reason)
{
	std::stringstream stream;
	stream << "Demo.conn.onPresence('{type: \"subscribe\",from : \"";
	stream << username;
	stream << "\", status : \"";
	stream << reason;
	stream << "\"}');";
	CallJS(stream);
}
void ContactListener::onContactAgreed(const std::string &username)
{
	std::stringstream stream;
	stream << "Demo.conn.onRoster('{subscription: \"both\",name : \"";
	stream << username;
	stream << "\"}');";
	CallJS(stream);
}
void ContactListener::onContactRefused(const std::string &username)
{
}