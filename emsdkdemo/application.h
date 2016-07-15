#ifndef _APPLICATION_HYPHENATE_UIDEMO
#define _APPLICATION_HYPHENATE_UIDEMO

#include <emclient.h>
extern easemob::EMClient *g_client;

class CWndManager
{
public:
	CWndManager()
	{}

	virtual ~CWndManager()	{}

	virtual void AddWnd(std::string id, void * wnd)
	{
		if (wnd == NULL)
			return;

		wnds_[id] = wnd;
	}

	virtual bool HasWnd(std::string id)
	{
		return wnds_[id] != nullptr;
	}

	virtual void RemoveWnd(void * wnd)
	{
		if (wnd == NULL)
			return;

		WndMap::iterator it = wnds_.begin();
		for (; it != wnds_.end(); ++it)
		{
			if (it->second == wnd)
			{
				wnds_.erase(it);
				break;
			}
		}
	}
protected:
	typedef std::map<std::string, void*> WndMap;
	WndMap wnds_;
};

extern CWndManager *g_WndManager;

#endif