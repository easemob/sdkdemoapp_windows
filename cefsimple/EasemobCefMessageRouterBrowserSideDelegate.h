#pragma once
#include "simple_handler.h"
#include "include/cef_base.h"
#include "include/wrapper/cef_message_router.h"

class EasemobCefQueryHandler;
class SimpleHandler;

class EasemobCefMessageRouterBrowserSideDelegate : public virtual CefBase
{
public:
  EasemobCefMessageRouterBrowserSideDelegate();
  ~EasemobCefMessageRouterBrowserSideDelegate();

  bool OnProcessMessageReceived(
	  CefRefPtr<SimpleHandler> client,
    CefRefPtr<CefBrowser> browser,
    CefProcessId source_process,
    CefRefPtr<CefProcessMessage> message);

  void OnBeforeClose(CefRefPtr<SimpleHandler> client,
    CefRefPtr<CefBrowser> browser);

  void OnRenderProcessTerminated(CefRefPtr<SimpleHandler> client,
    CefRefPtr<CefBrowser> browser);

  void OnBeforeBrowse(CefRefPtr<SimpleHandler> client,
    CefRefPtr<CefBrowser> browser,
    CefRefPtr<CefFrame> frame);

private:
  CefRefPtr<CefMessageRouterBrowserSide> message_router_;
  EasemobCefQueryHandler *m_ecqh;
private:
  IMPLEMENT_REFCOUNTING(EasemobCefMessageRouterBrowserSideDelegate);
};

