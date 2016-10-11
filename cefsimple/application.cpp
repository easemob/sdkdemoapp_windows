
#include "application.h"
using namespace easemob;

EMClient *g_client;
HANDLE Utils::g_RosterDownloaded = CreateEvent(NULL, TRUE, FALSE, NULL);
HANDLE Utils::g_GroupListDownloaded = CreateEvent(NULL, TRUE, FALSE, NULL);

void Utils::CallJS(const std::stringstream & stream)
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