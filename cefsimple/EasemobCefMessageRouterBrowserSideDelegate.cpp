#include "EasemobCefMessageRouterBrowserSideDelegate.h"
#include "EasemobCefQueryHandler.h"


EasemobCefMessageRouterBrowserSideDelegate::EasemobCefMessageRouterBrowserSideDelegate()
{
  CefMessageRouterConfig config;
  message_router_ = CefMessageRouterBrowserSide::Create(config);
  m_ecqh = new EasemobCefQueryHandler();
  message_router_->AddHandler(m_ecqh, false);
}


EasemobCefMessageRouterBrowserSideDelegate::~EasemobCefMessageRouterBrowserSideDelegate()
{
	delete m_ecqh;
}

bool EasemobCefMessageRouterBrowserSideDelegate::OnProcessMessageReceived(
	CefRefPtr<SimpleHandler> client,
  CefRefPtr<CefBrowser> browser,
  CefProcessId source_process,
  CefRefPtr<CefProcessMessage> message)
{
  return message_router_->OnProcessMessageReceived(browser, source_process,
    message);
}

void EasemobCefMessageRouterBrowserSideDelegate::OnBeforeClose(CefRefPtr<SimpleHandler> client,
  CefRefPtr<CefBrowser> browser)
{
  message_router_->OnBeforeClose(browser);
}

void EasemobCefMessageRouterBrowserSideDelegate::OnRenderProcessTerminated(CefRefPtr<SimpleHandler> client,
  CefRefPtr<CefBrowser> browser)
{
  message_router_->OnRenderProcessTerminated(browser);
}

void EasemobCefMessageRouterBrowserSideDelegate::OnBeforeBrowse(CefRefPtr<SimpleHandler> client,
  CefRefPtr<CefBrowser> browser,
  CefRefPtr<CefFrame> frame)
{
  message_router_->OnBeforeBrowse(browser, frame);
}
