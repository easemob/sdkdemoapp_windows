#include "DevtoolClient.h"
#include "Devtool.h"

CDevtoolClient::CDevtoolClient(CefWindowInfo& windowInfo, CefBrowserSettings& settings)
{
  browser_ = nullptr;
  devtool_ = new CDevtool();
  devtool_->m_client = this;
  devtool_->Create(NULL);
  devtool_->ShowWindow(SW_SHOWNA);
  RECT rc = { 0, 0, 100, 100 };
  devtool_->GetWindowRect(&rc);
  rc.right = rc.right - rc.left;
  rc.bottom = rc.bottom - rc.top;
  rc.left = 0;
  rc.top = 0;
  windowInfo.SetAsChild(devtool_->m_hWnd, rc);
}


CDevtoolClient::~CDevtoolClient()
{
}

bool CDevtoolClient::OnProcessMessageReceived(
  CefRefPtr<CefBrowser> browser,
  CefProcessId source_process,
  CefRefPtr<CefProcessMessage> message) {
  CEF_REQUIRE_UI_THREAD();

  return false;
}


void CDevtoolClient::OnAfterCreated(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();

  if (!GetBrowser())   {
    // We need to keep the main child window, but not popup windows
    browser_ = browser;
  }
}

bool CDevtoolClient::DoClose(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();
  return !!GetBrowser();
}

void CDevtoolClient::OnBeforeClose(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();
  browser_ = nullptr;
}

CefRefPtr<CefBrowser> CDevtoolClient::GetBrowser() const
{
  return browser_;
}