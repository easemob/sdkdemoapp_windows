#ifndef ChatroomChatDialog_HPP
#define ChatroomChatDialog_HPP

#include "chat_dialog.hpp"

class ChatroomChatDialog : public ChatDialog
{
public:

	ChatroomChatDialog(const CDuiString& bgimage, DWORD bkcolor, const ListItemInfo& myselft_info, const ListItemInfo& friend_info, std::string conversationID);
	~ChatroomChatDialog();

	virtual LPCTSTR GetWindowClassName() const;	

	virtual void InitWindow();

	virtual CDuiString GetSkinFile();


	virtual CControlUI* CreateControl(LPCTSTR pstrClass);

	virtual LRESULT HandleMessage(UINT uMsg, WPARAM wParam, LPARAM lParam);


	virtual BOOL Receive(MessageEventParam param);

    void SendMsg();


protected:	

	void Notify(TNotifyUI& msg);
	void OnPrepare(TNotifyUI& msg);


	std::vector<ListItemInfo> members_;
};

#endif // ChatroomChatDialog_HPP