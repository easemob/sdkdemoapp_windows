// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#ifndef CEF_TESTS_CEFSIMPLE_SIMPLE_APP_H_
#define CEF_TESTS_CEFSIMPLE_SIMPLE_APP_H_

#include "include/cef_app.h"
#include "EasemobCefMessageRouterRendererSideDelegate.h"
class EasemobCefMessageRouterRendererSideDelegate;

class SimpleApp : public CefApp,
                  public CefBrowserProcessHandler,
				  public CefRenderProcessHandler
{
 public:
  SimpleApp();

  // CefApp methods:
  virtual CefRefPtr<CefBrowserProcessHandler> GetBrowserProcessHandler() OVERRIDE 
  {
	  return this; 
  }
  virtual CefRefPtr<CefRenderProcessHandler> GetRenderProcessHandler() OVERRIDE
  {
	  return this;
  }

  // CefBrowserProcessHandler methods:
  virtual void OnContextInitialized() OVERRIDE;

  // CefRenderProcessHandler methods.
  virtual void OnRenderThreadCreated(CefRefPtr<CefListValue> extra_info) OVERRIDE;
  virtual void OnWebKitInitialized() override;
  virtual void OnContextCreated(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  CefRefPtr<CefV8Context> context) override;
  virtual void OnContextReleased(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  CefRefPtr<CefV8Context> context) override;
  virtual bool OnProcessMessageReceived(
	  CefRefPtr<CefBrowser> browser,
	  CefProcessId source_process,
	  CefRefPtr<CefProcessMessage> message) override;

 private:
  CefRefPtr<EasemobCefMessageRouterRendererSideDelegate> js_render_delegate_;
  // Include the default reference counting implementation.
  IMPLEMENT_REFCOUNTING(SimpleApp);
};

#endif  // CEF_TESTS_CEFSIMPLE_SIMPLE_APP_H_
