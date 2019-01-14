

export const streamAddAction = payload => ({
	type: "app/streamAdd",
	payload
});

export const streamRemovedAction = payload => ({
	type: "app/streamRemoved",
	payload
});

export const removedAllStreamsAction = payload => ({
	type: "app/streamsAllRemoved",
	payload
});

export const currentStreamAction = payload => ({
	type: "app/currentStream",
	payload
});

export const updateStreamAction = payload => ({
	type: "app/updateStream",
	payload
});

export const localStreamAction = payload => ({
	type: "app/localStream",
	payload
});
