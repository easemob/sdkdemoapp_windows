#pragma once
#include "include/wrapper/cef_message_router.h"
#include "include/cef_base.h"
#include "simple_app.h"
class SimpleApp;

class EasemobCefMessageRouterRendererSideDelegate : public virtual CefBase
{
public:
  EasemobCefMessageRouterRendererSideDelegate();
  ~EasemobCefMessageRouterRendererSideDelegate();

  void OnWebKitInitialized(CefRefPtr<SimpleApp> app);

  void OnContextCreated(CefRefPtr<SimpleApp> app,
    CefRefPtr<CefBrowser> browser,
    CefRefPtr<CefFrame> frame,
    CefRefPtr<CefV8Context> context);

  void OnContextReleased(CefRefPtr<SimpleApp> app,
    CefRefPtr<CefBrowser> browser,
    CefRefPtr<CefFrame> frame,
    CefRefPtr<CefV8Context> context);

  bool OnProcessMessageReceived(
	  CefRefPtr<SimpleApp> app,
    CefRefPtr<CefBrowser> browser,
    CefProcessId source_process,
    CefRefPtr<CefProcessMessage> message);

private:
  CefRefPtr<CefMessageRouterRendererSide> message_router_;

private:
  IMPLEMENT_REFCOUNTING(EasemobCefMessageRouterRendererSideDelegate);
};

