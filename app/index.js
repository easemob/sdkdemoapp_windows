import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import "@/style/app.scss";
import IndexView from "@/views/index";
import configureStore from "@/stores";

ReactDOM.render(
	<Router>
		<Provider store={ configureStore() }>
			<IndexView />
		</Provider>
	</Router>,
	document.getElementById("appContainer"), () => {
		const loadingElement = document.getElementById("loading");
		loadingElement.parentNode.removeChild(loadingElement);
	}
);
