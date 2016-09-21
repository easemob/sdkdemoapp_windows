// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#ifndef CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_
#define CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_
#include "EasemobCefMessageRouterBrowserSideDelegate.h"      

#include "include/cef_client.h"
#include "include/base/cef_lock.h"

#include <list>
class EasemobCefMessageRouterBrowserSideDelegate;

class SimpleHandler : public CefClient,
                      public CefContextMenuHandler,
                      public CefDisplayHandler,
                      public CefLifeSpanHandler,
                      public CefLoadHandler {
 public:
  SimpleHandler();
  ~SimpleHandler();

  // Provide access to the single global instance of this object.
  static SimpleHandler* GetInstance();

  // CefClient methods:
  virtual CefRefPtr<CefDisplayHandler> GetDisplayHandler() OVERRIDE {
    return this;
  }
  virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() OVERRIDE {
    return this;
  }
  virtual CefRefPtr<CefLoadHandler> GetLoadHandler() OVERRIDE {
    return this;
  }

  virtual CefRefPtr<CefContextMenuHandler> GetContextMenuHandler() OVERRIDE{
	  return this;
  }


  // CefClient methods
  virtual bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser,
  CefProcessId source_process,  CefRefPtr<CefProcessMessage> message)override;

  // CefDisplayHandler methods:
  virtual void OnTitleChange(CefRefPtr<CefBrowser> browser,
                             const CefString& title) OVERRIDE;

  // CefLifeSpanHandler methods:
  virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual bool DoClose(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual bool OnBeforePopup(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  const CefString& target_url,
	  const CefString& target_frame_name,
	  CefLifeSpanHandler::WindowOpenDisposition target_disposition,
	  bool user_gesture,
	  const CefPopupFeatures& popupFeatures,
	  CefWindowInfo& windowInfo,
	  CefRefPtr<CefClient>& client,
	  CefBrowserSettings& settings,
	  bool* no_javascript_access) override;

  // CefContextMenuHandler methods
  virtual void OnBeforeContextMenu(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  CefRefPtr<CefContextMenuParams> params,
	  CefRefPtr<CefMenuModel> model) override;
  virtual bool OnContextMenuCommand(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  CefRefPtr<CefContextMenuParams> params,
	  int command_id,
	  EventFlags event_flags) override;

  // CefLoadHandler methods:
  virtual void OnLoadError(CefRefPtr<CefBrowser> browser,
                           CefRefPtr<CefFrame> frame,
                           ErrorCode errorCode,
                           const CefString& errorText,
                           const CefString& failedUrl) OVERRIDE;

  // Request that all existing browser windows close.
  void CloseAllBrowsers(bool force_close);

  bool IsClosing() const { return is_closing_; }

  CefRefPtr<CefBrowser> GetBrowser() const;

  // Show a new DevTools popup window.
  void ShowDevTools(CefRefPtr<CefBrowser> browser,
	  const CefPoint& inspect_element_at);

 private:
  // List of existing browser windows. Only accessed on the CEF UI thread.
  typedef std::list<CefRefPtr<CefBrowser> > BrowserList;
  BrowserList browser_list_;

  bool is_closing_;
  mutable base::Lock lock_;
  CefRefPtr<CefBrowser> browser_;
  CefRefPtr<EasemobCefMessageRouterBrowserSideDelegate> js_browser_delegate_;

  bool CreatePopupWindow(
	  CefRefPtr<CefBrowser> browser,
	  bool is_devtools,
	  const CefPopupFeatures& popupFeatures,
	  CefWindowInfo& windowInfo,
	  CefRefPtr<CefClient>& client,
	  CefBrowserSettings& settings);

  // Include the default reference counting implementation.
  IMPLEMENT_REFCOUNTING(SimpleHandler);
};

#endif  // CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_
