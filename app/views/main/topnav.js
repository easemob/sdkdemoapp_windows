import React, { Component } from "react";
import { connect } from "react-redux";
import {
	Icon,
	Menu,
	Dropdown,
	Modal,
	Button,
	Form,
	Input,
	Upload
} from "antd";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import HeadImageView from "@/views/common/head_image";
var _const = require("@/views/common/domain");
const { ipcRenderer } = require("electron");
const FormItem = Form.Item;


class FormInput extends Component {

	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		const { userInfo } = this.props.reduxProps;
		this.state = {
			realName: userInfo.user.realName || userInfo.user.username || userInfo.user.easemobName,
			mobilephone: userInfo.user.mobilephone,
			email: userInfo.user.email,
		};
	}

	handleSubmit(e){
		const { userInfo, globals } = this.props.reduxProps;
		const avatar = this.props.avatar;
		const handleCancel = this.props.event;
		var tenantId = userInfo.user.tenantId;
		var userId = userInfo.user.id;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if(!err){
				values.image = avatar;
				handleCancel();
			}
		});
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={ this.handleSubmit } hideRequiredMark={true}>
				<FormItem
					label="用户名:"
					labelCol={ { span: 7 } }
					wrapperCol={ { span: 17 } }
				>
					{getFieldDecorator("realName", {
						rules: [{ required: true, message: "请输入姓名!" }],
						initialValue: this.state.realName
					})(
						<Input />
					)}
				</FormItem>
				<FormItem
					wrapperCol={ { span: 4, offset: 9 } }
				>
					<Button type="primary" htmlType="submit">
						保存
					</Button>
				</FormItem>
			</Form>
		);
	}

}

const WrappedApp = Form.create()(FormInput);

class TopNav extends Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handlePreviewAvatar = this.handlePreviewAvatar.bind(this);
		this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
		this.handleCancelAvatar = this.handleCancelAvatar.bind(this);
		const { userInfo } = this.props;
		this.state = {
			visible: false,
			previewVisible: false,
			previewImage: "",
			fileList: [
				{
					uid: -1,
					name: "",
					status: "done",
					url: ""
				}
			],
		};
	}

	handlePreviewAvatar(file){
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	handleChangeAvatar({ fileList, file }){
		const { setNotice, userInfo } = this.props;
		this.setState({ fileList });
		if(file.status == "done"){
			this.setState({ avatarUrl: file.response.url });
		}
		else if(file.status == "error"){
			if(file.error.status == 413){
				setNotice("上传失败，上传头像过大", "fail");
				this.setState({ fileList: [
					{
						uid: -1,
						name: "",
						status: "done",
						url: this.imgUrl(userInfo.user.image),
					}
				] });
			}
		}
	}

	handleCancelAvatar(){
		this.setState({ previewVisible: false });
	}

	showModal(){
		this.setState({
			visible: true,
		});
	}

	handleOk(e){
		this.setState({
			visible: false,
		});
	}

	handleCancel(e){
		this.setState({
			visible: false,
		});
	}

	handleClick(e){
		const { globals, logout } = this.props;
		var emclient = globals.emclient;
		switch(e.key){
		case "personal":
			this.showModal();
			break;
		case "changePwd":
			emclient.logout();
			logout();
			break;
		case "cancellation":
			emclient.logout();
			this.props.history.push('/index');
			logout();
			localStorage.clear();
			break;
		case "logout":
			emclient.logout().then((res) => {
				logout();
			})
			
			break;
		default:
			break;
		}
	}

	imgUrl(imgUrl){
		// const { imgUrl } = this.props;
		if(!imgUrl){
			return require("@/views/config/img/default_avatar.png");
		}
		else if(imgUrl.indexOf("http") == 0){
			return imgUrl;
		}
		return `${_const.domain}${imgUrl}`;
	}

	render(){
		const { userInfo } = this.props;
		const { previewVisible, previewImage, fileList } = this.state;
		const menu = (
			<Menu onClick={ this.handleClick } style={ { width: 100 } }>
				<Menu.Item key="personal">
					<span>个人资料</span>
				</Menu.Item>
				<Menu.Divider />
				{/* <Menu.Item key="changePwd">
					<span>修改密码</span>
				</Menu.Item> */}
				<Menu.Item key="cancellation">
					<span>注销</span>
				</Menu.Item>
				{/* <Menu.Item key="logout">
					<span>退出</span>
				</Menu.Item> */}
			</Menu>
		);
		return (
			<div className="nav-user">
				{/* <Icon type="user" /> */}
				<Dropdown
					overlay={ menu } trigger={ [ "click" ] } placement="bottomLeft"
					style={ { top: 35, left: 60 } }
				>
					{/* 很奇怪，这个不能用头像组件，下拉菜单谈不出来 */}
					{/* <HeadImageView imgUrl={ userInfo.user.image } /> */}
					{/* <img src={ this.imgUrl(userInfo.user.image) } /> */}
					<div className="member-img" style={ { width: "40px", height: "40px", borderRadious: "50%", backgroundImage: `url(${this.imgUrl("")})` } }></div>
				</Dropdown>
				<Modal
					visible={ this.state.visible }
					onOk={ this.handleOk }
					onCancel={ this.handleCancel }
					closable={ false }
					footer={ null }
					mask={ false }
					style={ { top: 60, right: 25 } }
					width={ 260 }
					wrapClassName="user-info-setting"
					bodyStyle={ { margin: 0 } }
				>
					<div className="user-avatar">
						<Modal visible={ previewVisible } footer={ null } onCancel={ this.handleCancelAvatar }>
							<img alt="example" style={ { width: "100%" } } src={ previewImage } />
						</Modal>
					</div>
					<div className="user-info">
						<WrappedApp
							reduxProps={ this.props }
							avatar={ this.state.avatarUrl }
							event={ this.handleCancel }
						/>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	allUnReadMsgCount: selectors.allUnReadMsgCount(state),
	userInfo: state.userInfo,
	globals: state.globals
});
export default connect(mapStateToProps, actionCreators)(TopNav);
