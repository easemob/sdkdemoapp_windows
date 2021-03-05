import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {Route, Redirect} from 'react-router-dom';
import _ from "underscore";
import * as actionCreators from "@/stores/actions";
import Lang from "@/lang";
import * as selectors from "@/stores/selectors";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { utils } from "@/utils/utils";
const session = require("electron").remote.session;
// const fs = require("fs-extra");
// const { remote } = require("electron");
// let configDir = remote.app.getPath("userData");
// const easemob = require('../../node/index');
var checkedVal;
class LoginForm extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			userName: "",
			password: "",
		};
		const { logout } = this.props;
		this.getCookie();

		this.handleChangeUserName = this.handleChangeUserName.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleChangeRember = this.handleChangeRember.bind(this);
		this.handleSetCookie = this.handleSetCookie.bind(this);
	}

	handleChangeUserName(e){
		this.setState({ userName: e.target.value });
	}

	handleChangePassword(e){
		this.setState({ password: e.target.value });
	}

	getCookie(key){
		var me = this;
		session.defaultSession.cookies.get({ url: "http://www.github.com", name: key }, function(error, cookies){
			let userName = '';
			let password = '';
			if(cookies.length){
				checkedVal = true;
			}
			else{
				checkedVal = false;
			}
			_.map(cookies, (item) => {
				if(item.name == "userName"){
					userName = item.value;
				}
				if(item.name == "password"){
					password = item.value;
				}
			});
			me.setState({
				userName: userName,
				password: password,
			});
		});
	}

	// 记住密码
	handleChangeRember(obj){
		checkedVal = obj.target.checked;
	}

	// 设置 cookie
	handleSetCookie(name, value){
		let Days = 30;
		let exp = new Date();
		let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60;
		const cookie = {
			url: "http://www.github.com",
			name,
			value,
			expirationDate: date
		};
		session.defaultSession.cookies.set(cookie, (error) => {
			if(error){
				console.error(error);
			}
		});
	}

	// 清除 cookie
	handleRemoveCookie(){
		session.defaultSession.clearStorageData({
			origin: "http://www.github.com",
			storages: ["cookies"]
		}, function(error){
			if(error){
				console.error(error);
			}
		});
	}

	handleLogin(){
		const { requestLogin, setNotice, logout, globalAction, globals } = this.props.reduxProps;
		// 记住密码 写 cookie
		if(checkedVal){
			this.handleSetCookie("userName", this.state.userName);
			this.handleSetCookie("password", this.state.password);
		}
		// 删除 cookie
		else{
			this.handleRemoveCookie();
		}
		if(navigator.onLine){
			var userInfo = {
				"user":{
					"easemobName":this.state.userName.toLowerCase(),
					"id":1,
					"easemobPwd":this.state.password,
					"os":"PC",
					"appkey":"easemob-demo#easeim",
					"tenantId":9,
					"image":""
				}
			};
		// 	if(globals.emclient){
		// 		this.emclient = globals.emclient;
		// 	}
		// 	else{
		// 		this.emclient = utils.initEmclient();
		// 	}

		// 	this.emclient.login( this.state.userName, this.state.password).then((res) => {
		// 		console.log(`loginCode:${res.code}`);
		// 	if(res.code != 0){
		// 		setNotice(`登录失败，${res.code}`);
		// 		this.emclient.logout();
		// 		logout();
		// 		return false;
		// 	}
			
		 	this.props.reduxProps.history.push("/chats/recents");
		// });
		// //这个放到成功里
		// globalAction({
		// 	emclient: this.emclient
		// });
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
		requestLogin(userInfo);
		}
		else{
			setNotice("当前网络不可用，请检查网络状态", "fail");
		}

	}


	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<Form
				onSubmit={
					(e) => {
						e.preventDefault();
						(this.state.userName && this.state.password)
							? this.handleLogin()
							: null;
					}
				} className="login-form"
			>
				<FormItem>
					{getFieldDecorator("userName", {
						rules: [{ required: true, message: Lang.string("login.account.required") } ],
						initialValue: this.state.userName
					})(
						<Input
							prefix={ <Icon type="user"style={ { color: "rgba(0,0,0,.25)" } } /> }
							placeholder={ Lang.string("login.account.hint") }
							onChange={ this.handleChangeUserName }
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator("password", {
						rules: [{ required: true, message: Lang.string("login.password.required") } ],
						initialValue: this.state.password
					})(
						<Input
							prefix={ <Icon type="lock" style={ { color: "rgba(0,0,0,.25)" } } /> }
							type="password"
							placeholder={ Lang.string("login.password.label") }
							onChange={ this.handleChangePassword }
						/>
					)}
					{getFieldDecorator("remember", {
						valuePropName: "checked",
						initialValue: checkedVal,
					})(
						<Checkbox onChange={ this.handleChangeRember } >记住密码</Checkbox>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button">
						{ Lang.string("login.btn.label") }
					</Button>
				</FormItem>
				<Link to="/register">
					注册
				</Link>
			</Form>
		);
	}
}
const FormItem = Form.Item;
const WrappedLoginForm = Form.create()(LoginForm);
class Login extends PureComponent {
	render(){
		return (
			<div className="app-login-form">
				<WrappedLoginForm reduxProps={ this.props } />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	globals: state.globals,
});
export default connect(mapStateToProps, actionCreators)(Login);
