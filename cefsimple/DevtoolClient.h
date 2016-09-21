#pragma once
#include "include/cef_client.h"
#include "include/base/cef_lock.h"
#include "include/wrapper/cef_helpers.h"
#include "include/base/cef_macros.h"

class CDevtool;


class CDevtoolClient : public CefClient,
  public CefLifeSpanHandler
{
public:
  CDevtoolClient(CefWindowInfo& windowInfo, CefBrowserSettings& settings);
  ~CDevtoolClient();

  virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() override{
    return this;
  }

  // CefClient methods
  virtual bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser,
    CefProcessId source_process,
    CefRefPtr<CefProcessMessage> message)
    override;

  // CefLifeSpanHandler methods:
  virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) override;
  virtual bool DoClose(CefRefPtr<CefBrowser> browser) override;
  virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) override;

  CefRefPtr<CefBrowser> GetBrowser() const;
private:
  // Include the default reference counting implementation.

  CDevtool* devtool_;
  CefRefPtr<CefBrowser> browser_;
  IMPLEMENT_REFCOUNTING(CDevtoolClient);
  DISALLOW_COPY_AND_ASSIGN(CDevtoolClient);
};

