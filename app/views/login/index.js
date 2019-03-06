import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Spin, Icon } from "antd";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import Login from "./form";
const { ipcRenderer } = require("electron");

class LoginView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
		};
		this.handleRender = this.handleRender.bind(this);
	}

	handleRender(){
		ipcRenderer.on("message", (event, { message, data, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate }) => {
			console.log(message, data);
			switch(message){
			case "isUpdateNow":
				console.log(message, data, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate);
				ipcRenderer.send("updateNow");
				break;
			default:
				break;
			}
		});
	}

	render(){
		const { areRequestsPending } = this.props;
		return (
			<div>
				{/* {
					this.handleRender()
				} */}

				{/* 为了做一个拖动区域 */}
				<div className="login-drag"></div>
				<div className="oa-login">
					<div className="login-logo">
						<img src={ require(`@/views/config/img/logo.png`) } />
					</div>
					<div className="app-login center-content">
						<section>
							<Login {...this.props}/>
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
	loginState: state.userInfo,
	loginRequest: selectors.getRequest(state, "login"),
	areRequestsPending: selectors.areRequestsPending(selectors.getRequests(state)),
});
export default connect(mapStateToProps, actionCreators)(LoginView);
