#ifndef _UTILS_HYPHENATE_UIDEMO
#define _UTILS_HYPHENATE_UIDEMO
#include <stdint.h>
namespace utils
{
	wchar_t* UTF8_to_Unicode(const char* utf, size_t *unicode_number);
	char* Unicode_to_UTF8(const wchar_t* unicode);
	string getJsonValue(wstring file, string key);
	bool setJsonValue(wstring file, string key, string val);
	wstring GetAppDataDirW();
	string GetAppDataDir();
	const TCHAR* const kAccountsFile = _T("accounts.json");
	wstring GetLocalTime();
	void unixTime2Str(int64_t n, TCHAR strTime[], int bufLen);
	void Replace(std::wstring& strText, const WCHAR * lpOldStr, const WCHAR * lpNewStr);
	BOOL IsDigit(const WCHAR * lpStr);
	wstring GetBetweenString(const WCHAR * pStr, const WCHAR * pStart, const WCHAR * pEnd);
	int GetBetweenInt(const WCHAR * pStr, const WCHAR * pStart,
		const WCHAR * pEnd, int nDefValue = 0);
}
#endif
// namespace utils