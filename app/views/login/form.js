import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import Lang from "@/lang";
import * as selectors from "@/stores/selectors";
import { Form, Icon, Input, Button, Checkbox } from "antd";
const session = require("electron").remote.session;
var checkedVal;
class LoginForm extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			userName: "",
			password: "",
		};
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

	getCookie(){
		var me = this;
		session.defaultSession.cookies.get({ url: "http://www.github.com" }, function(error, cookies){
			if(cookies.length){
				checkedVal = true;
			}
			else{
				checkedVal = false;
			}
			me.setState({
				userName: cookies.length ? cookies[0].value : "",
				password: cookies.length ? cookies[1].value : "",
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
		const { requestLogin, setNotice } = this.props.reduxProps;
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
			requestLogin(this.state.userName, this.state.password, "PC");
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
	loginRequest: selectors.getRequest(state, "login"),
});
export default connect(mapStateToProps, actionCreators)(Login);
