import { combineReducers } from "redux";
import _ from "underscore";


export const streams = (state = {}, { type, payload = {} }) => {
	let result = {};
	switch(type){
	case "app/streamAdd":
		return _.extend({}, state, payload);
	case "app/streamRemoved":
		result = _.clone(state);
		delete result[payload.id];
		if(payload.insteadStream){
			delete result[payload.insteadStream.stream.owner.name];
		}
		return result;
	case "app/streamsAllRemoved":
		return {};
	case "app/updateStream":
		return _.extend({}, state, { [payload.id]: payload.stream });
	default:
		return state;
	}
};

const currentStreamId = (state = "", { type, payload = "" }) => {
	switch(type){
	case "app/currentStream":
		return payload;
	default:
		return state;
	}
};

// app/localStream
const localStream = (state = {}, { type, payload = {} }) => {
	switch(type){
	case "app/localStream":
		return payload;
	default:
		return state;
	}
};

export default combineReducers({
	streams,
	localStream,
	currentStreamId
});
