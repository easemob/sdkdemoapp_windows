import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Modal, Progress } from "antd";
import * as actionCreators from "@/stores/actions";
const { ipcRenderer } = require("electron");
import _ from "underscore";

class UpdateView extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			updateVisible: false,
			downloadVisible: false,
			downloadProgress: 0,
			newVersion: 0
		};
		this.releaseNotes = "";
		this.handleRender = this.handleRender.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleCancelUpdate = this.handleCancelUpdate.bind(this);
	}

	handleRender(){
		ipcRenderer.on("message", (event, { message, data }) => {
			switch(message){
			case "isUpdateNow":
				console.log(message, data);
				this.releaseNotes = data.releaseNotes;
				this.setState({
					updateVisible: true,
					newVersion: data.version
				});
				break;
			// case "downloadProgress":
			// 	this.setState({
			// 		updateVisible: false,
			// 		downloadVisible: true,
			// 		downloadProgress: data.percent
			// 	});
			// 	if(data.percent == 100){
			// 		this.setState({
			// 			downloadVisible: false,
			// 		});
			// 	}
			// 	break;
			default:
				break;
			}
		});
	}

	handleUpdate(){
		ipcRenderer.send("updateNow");

	}

	handleCancelUpdate(){
		this.setState({
			updateVisible: false
		});
	}

	render(){
		return (
			<div>
				{
					this.handleRender()
				}
				<Modal
					title="检测更新"
					visible={ this.state.updateVisible }
					cancelText="跳过"
					okText="更新"
					onCancel={ this.handleCancelUpdate }
					onOk={ this.handleUpdate }
				>
					<p>检测到有新版本{ this.state.newVersion}，请确定是否更新</p>
					<p>更新内容如下：</p>
					<div style={ { padding: "10px", background: "#24BDB9", color: "#fff", maxHeight: "280px", overflowY: "auto", marginTop: "5px" } }>
						{
							_.map(this.releaseNotes.split(";"), (note, index) => {
								return <p key={ index }>{ note }</p>;
							})
						}
					</div>
				</Modal>
				<Modal
					title="正在下载"
					visible={ this.state.downloadVisible }
					footer={ null }
				>
					<Progress percent={ this.state.downloadProgress } status="active" />
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = state => ({
});
export default connect(mapStateToProps, actionCreators)(UpdateView);
