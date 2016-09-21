
#include "application.h"
using namespace easemob;

EMClient *g_client;

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