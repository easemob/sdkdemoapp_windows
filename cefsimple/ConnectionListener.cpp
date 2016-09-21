#include "ConnectionListener.h"
#include "application.h"

void ConnectionListener::onDisconnect(EMErrorPtr error) {
	std::stringstream stream;
	if (error->mErrorCode == EMError::SERVER_UNKNOWN_ERROR)
	{
		stream << "Demo.conn.onOffline();";
	}
	else
	{
		stream << "Demo.conn.onError('{\"code\": \"";
		stream << error->mErrorCode;
		stream << "\",\"desc\":\"";
		stream << error->mDescription;
		stream << "\"}');";
	}
	Utils::CallJS(stream);
}

void ConnectionListener::onConnect() {

}