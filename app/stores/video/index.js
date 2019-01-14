import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducer";

// 这是官网推荐的 log 插件
const logger = createLogger({ collapsed: true });

// applyMiddleware 是一个 enhancer
// thunk 是一个 middleware
export default function configureStore(){
	return createStore(rootReducer, applyMiddleware(thunk, logger));
}
