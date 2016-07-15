#ifndef MESSAGE_EVENT_HPP
#define MESSAGE_EVENT_HPP

#include "observer_impl_base.hpp"
#include <stdint.h>
struct MessageEventParam
{
	CDuiString sBody;
	CDuiString sFrom;
	CDuiString sTo;
	CDuiString sAttachmentPath;
	CDuiString timestamp;
};

typedef class ObserverImpl<BOOL, MessageEventParam> MessageEventObserver;
typedef class ReceiverImpl<BOOL, MessageEventParam> MessageEventReceiver;


#endif // MESSAGE_EVENT_HPP