import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Switch, hashHistory } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import AppView from "./app_view";
import RegisterView from "../register";
import LoginView from "../login";

class IndexView extends PureComponent {
	render(){
		return (
			<div>
				<Router>
					<Switch>
					{/* <Route path="/image-cutter/:file?" component={ ImageCutterApp } /> */}
					<Route path="/" component={ AppView }/>
					</Switch>
				</Router>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(IndexView);
