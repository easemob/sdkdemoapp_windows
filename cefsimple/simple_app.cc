// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "cefsimple/simple_app.h"

#include <string>

#include "cefsimple/simple_handler.h"
#include "include/cef_browser.h"
#include "include/cef_command_line.h"
#include "include/wrapper/cef_helpers.h"
#include <shlwapi.h>
#pragma comment(lib, "shlwapi.lib")

std::wstring GetRunPath()
{
	WCHAR szEXEPath[MAX_PATH] = { 0 };
	GetModuleFileNameW(NULL, szEXEPath, MAX_PATH);
	PathRemoveFileSpecW(szEXEPath);

	return std::wstring(szEXEPath);
}

SimpleApp::SimpleApp() {
}

void SimpleApp::OnContextInitialized() {
  CEF_REQUIRE_UI_THREAD();

  // Information used when creating the native window.
  CefWindowInfo window_info;

#if defined(OS_WIN)
  // On Windows we need to specify certain flags that will be passed to
  // CreateWindowEx().
  window_info.SetAsPopup(NULL, "cefsimple");
#endif

  // SimpleHandler implements browser-level callbacks.
  CefRefPtr<SimpleHandler> handler(new SimpleHandler());

  // Specify CEF browser settings here.
  CefBrowserSettings browser_settings;

  std::wstring url;

  // Check if a "--url=" value was provided via the command-line. If so, use
  // that instead of the default URL.
  CefRefPtr<CefCommandLine> command_line =
      CefCommandLine::GetGlobalCommandLine();
  url = command_line->GetSwitchValue("url");
  if (url.empty())
  {
	  url = GetRunPath();
	  url += L"\\res\\index.html";
  }

  // Create the first browser window.
  CefBrowserHost::CreateBrowser(window_info, handler.get(), url,
                                browser_settings, NULL);
}

void SimpleApp::OnRenderThreadCreated(CefRefPtr<CefListValue> extra_info) {
	js_render_delegate_ = new EasemobCefMessageRouterRendererSideDelegate();
}

void SimpleApp::OnWebKitInitialized()
{
	js_render_delegate_->OnWebKitInitialized(this);
}

void SimpleApp::OnContextCreated(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	CefRefPtr<CefV8Context> context) {
	js_render_delegate_->OnContextCreated(this, browser, frame, context);
}

void SimpleApp::OnContextReleased(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	CefRefPtr<CefV8Context> context) {
	js_render_delegate_->OnContextCreated(this, browser, frame, context);
}

bool SimpleApp::OnProcessMessageReceived(
	CefRefPtr<CefBrowser> browser,
	CefProcessId source_process,
	CefRefPtr<CefProcessMessage> message) {
	DCHECK_EQ(source_process, PID_BROWSER);

	bool handled = false;
	handled = js_render_delegate_->OnProcessMessageReceived(this, browser, source_process,
		message);

	return handled;
}