#include "EasemobCefMessageRouterRendererSideDelegate.h"


EasemobCefMessageRouterRendererSideDelegate::EasemobCefMessageRouterRendererSideDelegate()
{
}


EasemobCefMessageRouterRendererSideDelegate::~EasemobCefMessageRouterRendererSideDelegate()
{
}

void EasemobCefMessageRouterRendererSideDelegate::OnWebKitInitialized(CefRefPtr<SimpleApp> app)
{
  CefMessageRouterConfig config;
  message_router_ = CefMessageRouterRendererSide::Create(config);
}

void EasemobCefMessageRouterRendererSideDelegate::OnContextCreated(CefRefPtr<SimpleApp> app,
  CefRefPtr<CefBrowser> browser,
  CefRefPtr<CefFrame> frame,
  CefRefPtr<CefV8Context> context)
{
  message_router_->OnContextCreated(browser, frame, context);
}

void EasemobCefMessageRouterRendererSideDelegate::OnContextReleased(CefRefPtr<SimpleApp> app,
  CefRefPtr<CefBrowser> browser,
  CefRefPtr<CefFrame> frame,
  CefRefPtr<CefV8Context> context)
{
  message_router_->OnContextReleased(browser, frame, context);
}

bool EasemobCefMessageRouterRendererSideDelegate::OnProcessMessageReceived(
	CefRefPtr<SimpleApp> app,
  CefRefPtr<CefBrowser> browser,
  CefProcessId source_process,
  CefRefPtr<CefProcessMessage> message)
{
  return message_router_->OnProcessMessageReceived(
    browser, source_process, message);
}