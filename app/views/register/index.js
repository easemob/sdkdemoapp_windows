import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import Register from "./form";
const { ipcRenderer } = require("electron");

class RegisterView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
	}

	render(){
		const { areRequestsPending } = this.props;
		return (
			<div>
				<div className="login-drag"></div>
				<div className="oa-login">
					<div className="login-logo">
						<img src={ require(`@/views/config/img/logo.png`) } />
					</div>
					<div className="app-login center-content">
						<section>
							<Register />
							{
								areRequestsPending
									? <Spin tip="Loading..." />
									: null
							}
						</section>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	// loginState: state.userInfo,
	// loginRequest: selectors.getRequest(state, "login"),
	areRequestsPending: selectors.areRequestsPending(selectors.getRequests(state)),
});
export default connect(mapStateToProps, actionCreators)(RegisterView);
