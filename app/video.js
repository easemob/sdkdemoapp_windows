import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "@/style/app.scss";
import IndexView from "@/views/video";
import configureStore from "@/stores/video";

ReactDOM.render(
	<Provider store={ configureStore() }>
		<IndexView />
	</Provider>,
	document.getElementById("videoContainer")
);
