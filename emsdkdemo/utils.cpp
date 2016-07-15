#include "stdafx.h"
#include "utils.h"
#include "json/json.h"
#include <fstream>
#include <shlobj.h>
#include <ctime>

#pragma   comment(lib, "shell32.lib")

using namespace std;

namespace utils
{
	wchar_t* UTF8_to_Unicode(const char* utf, size_t *unicode_number)
	{
		if (!utf || !strlen(utf))
		{
			*unicode_number = 0;
			return NULL;
		}
		int dwUnicodeLen = MultiByteToWideChar(CP_UTF8, 0, utf, -1, NULL, 0);
		size_t num = dwUnicodeLen*sizeof(wchar_t);
		wchar_t *pwText = (wchar_t*)malloc(num);
		memset(pwText, 0, num);
		MultiByteToWideChar(CP_UTF8, 0, utf, -1, pwText, dwUnicodeLen);
		*unicode_number = dwUnicodeLen - 1;
		return (wchar_t*)pwText;
	}

	char* Unicode_to_UTF8(const wchar_t* unicode)
	{
		int len;
		len = WideCharToMultiByte(CP_UTF8, 0, (const wchar_t*)unicode, -1, NULL, 0, NULL, NULL);
		char *szUtf8 = (char*)malloc(len + 1);
		memset(szUtf8, 0, len + 1);
		WideCharToMultiByte(CP_UTF8, 0, (const wchar_t*)unicode, -1, szUtf8, len, NULL, NULL);
		return szUtf8;
	}

	string getJsonValue(wstring file, string key)
	{
		ifstream ifs;
		ifs.open(file);
		if (!ifs.is_open()) return "";

		Json::Reader reader;
		Json::Value v;
		if (!reader.parse(ifs, v, false))
		{
			return false;
		}

		Json::Value::Members mem = v.getMemberNames();
		for (auto iter = mem.begin(); iter != mem.end(); iter++)
		{
			if (!key.compare(*iter))
				return v[*iter].asString();
		}

		return "";
	}

	bool setJsonValue(wstring file, string key, string val)
	{
		Json::Value v;

		ifstream ifs;
		ifs.open(file);
		if (ifs.is_open())
		{
			Json::Reader reader;
			if (!reader.parse(ifs, v, false)) return false;
		}
		v[key] = val;

		Json::FastWriter writer;
		std::string json_file = writer.write(v);

		ofstream ofs;
		ofs.open(file);
		if (!ofs.is_open()) return false;
		ofs << json_file;
		return true;
	}
	wstring GetAppDataDirW(){
		static wstring userdir;
		if (userdir.empty()){
			wchar_t buf[MAX_PATH + 1] = { 0 };
			::SHGetSpecialFolderPath(0, buf, CSIDL_APPDATA, 0);
			userdir = buf;
			userdir += _T("\\easemob_demo");
			if (!PathIsDirectory(userdir.c_str()))
			{
				::CreateDirectory(userdir.c_str(), NULL);
			}
		}
		return userdir;
	}
	string GetAppDataDir(){
		static string userdir;
		if (userdir.empty()){
			char buf[MAX_PATH + 1] = { 0 };
			::SHGetSpecialFolderPathA(0, buf, CSIDL_APPDATA, 0);
			userdir = buf;
			userdir += "\\easemob_demo";
			if (!PathIsDirectoryA(userdir.c_str()))
			{
				::CreateDirectoryA(userdir.c_str(), NULL);
			}
		}
		return userdir;
	}

	void unixTime2Str(int64_t n, TCHAR strTime[], int bufLen)
	{
		struct tm tm = *localtime((time_t *)&n);
		_tcsftime(strTime, bufLen - 1, _T("%Y-%m-%d %H:%M:%S"), &tm);
		strTime[bufLen - 1] = '\0';
	}

	wstring GetLocalTime()
	{
		SYSTEMTIME stime = { 0 };
		GetLocalTime(&stime); 
		TCHAR szBuf[MAX_PATH] = {0};
#if defined(UNDER_CE)
		_stprintf(szBuf, _T("%04d%02d%02d %02d:%02d:%02d"), stime.wYear, stime.wMonth, stime.wDay, stime.wHour, stime.wMinute, stime.wSecond);
#else
		_stprintf_s(szBuf, MAX_PATH, _T("%04d-%02d-%02d %02d:%02d:%02d"), stime.wYear, stime.wMonth, stime.wDay, stime.wHour, stime.wMinute, stime.wSecond);
#endif
		return wstring(szBuf);
	}
	void Replace(std::wstring& strText, const WCHAR * lpOldStr, const WCHAR * lpNewStr)
	{
		if (NULL == lpOldStr || NULL == lpNewStr)
			return;

		int nOldStrLen = wcslen(lpOldStr);
		int nNewStrLen = wcslen(lpNewStr);

		std::wstring::size_type nPos = 0;
		while ((nPos = strText.find(lpOldStr, nPos)) != std::wstring::npos)
		{
			strText.replace(nPos, nOldStrLen, lpNewStr);
			nPos += nNewStrLen;
		}
	}

	BOOL IsDigit(const WCHAR * lpStr)
	{
		for (const WCHAR * p = lpStr; *p != _T('\0'); p++)
		{
			int i = *p;
			if (i>0 && i<256 && !isdigit(*p))
				return FALSE;
		}
		return TRUE;
	}

	wstring GetBetweenString(const WCHAR * pStr, const WCHAR * pStart, const WCHAR * pEnd)
	{
		wstring strText;

		if (NULL == pStr || NULL == pStart || NULL == pEnd)
			return _T("");

		int nStartLen = _tcslen(pStart);

		const TCHAR * p1 = _tcsstr(pStr, pStart);
		if (NULL == p1)
			return _T("");

		const TCHAR * p2 = _tcsstr(p1 + nStartLen, pEnd);
		if (NULL == p2)
			return _T("");

		int nLen = p2 - (p1 + nStartLen);
		if (nLen <= 0)
			return _T("");

		TCHAR * lpText = new TCHAR[nLen + 1];
		if (NULL == lpText)
			return _T("");

		memset(lpText, 0, (nLen + 1)*sizeof(TCHAR));
		_tcsncpy(lpText, p1 + nStartLen, nLen);
		strText = lpText;
		delete[]lpText;

		return strText;
	}

	int GetBetweenInt(const WCHAR * pStr, const WCHAR * pStart,
		const WCHAR * pEnd, int nDefValue/* = 0*/)
	{
		wstring strText = GetBetweenString(pStr, pStart, pEnd);
		if (!strText.empty() && IsDigit(strText.c_str()))
			return _tcstol(strText.c_str(), NULL, 10);
		else
			return nDefValue;
	}

}// namespace utils

