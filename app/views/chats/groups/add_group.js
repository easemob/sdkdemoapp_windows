import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, Input, Menu, Spin, Icon } from "antd";
import { withRouter, Route, Link, NavLink } from "react-router-dom";
import * as actionCreators from "@/stores/actions";
import HeadImageView from "@/views/common/head_image";
import _ from "underscore";
const Search = Input.Search;

// const NavLink = ({ item }) => (
// 	<Menu.Item key={ item.id }> {item.orgName || item.realName} </Menu.Item>
// );

class AddGroup extends Component {
	constructor(props){
		super(props);
		this.state = {
			visible: false,
			page: 0,
			isSearch: false,
			selectGroupId: '',
			moreLoading: false,
			searchValue: ''
		}
		this.onSearchModalShow = this.onSearchModalShow.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onLoadMore = this.onLoadMore.bind(this);
		this.onPublicListClick = this.onPublicListClick.bind(this);
		this.getPublicGroup = this.getPublicGroup.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.onSearchGroup = this.onSearchGroup.bind(this);
		this.onChangeSearch = this.onChangeSearch.bind(this);
		this.emitEmpty = this.emitEmpty.bind(this);
	}

	componentDidMount(){
		// this.getPublicGroup();
	}

	getPublicGroup(){
		const { globals, publicGroup, getPublicGroupList } = this.props;
		const { page } = this.state;
		this.easemob = globals.easemob;
		this.error = new this.easemob.EMError();
		globals.groupManager.fetchPublicGroupsWithPage(page + 1, 5, this.error)
		.then(( res ) => {
			getPublicGroupList(publicGroup.concat(res));
			this.setState({
				page: page + 1,
				moreLoading: false
			});
		});
	}

	onSearchModalShow(){
		this.getPublicGroup();
		this.setState({
			visible: true
		});
	}

	handleCancel(){
		const { clearPublicGroupList } = this.props;
		clearPublicGroupList([]);
		this.setState({
			visible: false,
			page: 0,
			isSearch: false,
			searchValue: ""
		});
	}

	handleOk(){
		const { globals, setNotice, setGroupChats, clearPublicGroupList } = this.props;
		const { selectGroupId } = this.state;
		const error = new globals.easemob.EMError();
		if(selectGroupId){
			globals.groupManager.joinPublicGroup(selectGroupId, error)
			.then((res) => {
				if(error.errorCode == 0){
					globals.groupManager.fetchAllMyGroups(error)
					.then((groups) => {
						let allGroups = [];
						groups.map((group) => {
							allGroups.push(group.groupId());
						});
						setGroupChats({ allGroups });
					});
					clearPublicGroupList([]);
					this.setState({
						visible: false,
						page: 0,
						isSearch: false,
						searchValue: ""
					});
					setNotice("加入群组成功");
				}
				else{
					setNotice(`加入群组失败${error.description}`, "fail");
				}
			});
		}
		else{
			setNotice("请选择群组", "fail");
		}
	}

	onSearchGroup(value){
		const { globals, setNotice } = this.props;
		const error = new globals.easemob.EMError();
		globals.groupManager.searchPublicGroup(value, error)
		.then(( res ) => {
			if(error.errorCode == 0){
				this.setState({
					isSearch: true,
					searchResult: [res]
				});
			}
			else{
				setNotice("找不到改群组", "fail");
			}
		})
	}

	onChangeSearch(e){
		const { setNotice } = this.props;
		if(e.target.value){
			this.setState({
				searchValue: e.target.value
			})
		}
		else{
			setNotice("请输入内容", "fail");
		}
	}

	emitEmpty(){
		this.setState({
			isSearch: false,
			searchValue: ""
		})
	}

	onPublicListClick(e){
		this.setState({
			selectGroupId: e.key
		});
	}

	onLoadMore(){
		this.setState({
			moreLoading: true
		})
		this.getPublicGroup();
	}

	render(){
		const { publicGroup } = this.props;
		const { moreLoading, isSearch, searchResult, searchValue } = this.state;
		const listDate = isSearch ? searchResult : publicGroup;
		const suffix = searchValue ? <Icon key='0' type="close-circle" style={{paddingRight:"5px",color:"#ccc",transition: "color 0.3s"}} onClick={this.emitEmpty} /> : null;
		return (
			<div style={ { textAlign: 'center', padding: '15px 0' } }>
				<Button htmlType="submit" className="login-form-button" onClick={this.onSearchModalShow}>
					通过搜索添加群组
				</Button>
				<Modal
					title="搜索群组"
					visible={ this.state.visible }
					onOk={this.handleOk}
					onCancel={ this.handleCancel }
					mask={ false }
					style={ { top: 0 } }
					destroyOnClose={true}
					okText="申请入群"
					className="add_group_modal"
				>
					<div>
						<Search
							placeholder="输入群组ID"
							onSearch={ this.onSearchGroup }
							onChange={ this.onChangeSearch }
							value={ searchValue }
							suffix={ suffix }
						/>
						<div className="public_group_list">
							<Menu
								onClick={ this.onPublicListClick }
								style={ { width: "100%", border: "none", marginTop:"15px" } }
							>
								{
									listDate.map((group) => {
										return (
											<Menu.Item key={ group.groupId() }>
												<HeadImageView
													name={ group.groupSubject() }
												/>
												<div className="item-top">
													<span className="ellipsis item-name">
														{ group.groupSubject() }
													</span>
													<span className="ellipsis item-name" style={ { color: "#aaa" } }>
														{ `ID: ${group.groupId()}` }
													</span>
												</div>
											</Menu.Item>);
									})
								}
							</Menu>
						</div>
						{
							isSearch ? null :
								<div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
									{ moreLoading ? <Spin /> : <Button size="small" style={ { fontWeight: "normal", fontSize:"13px"} } onClick={this.onLoadMore}>加载更多</Button>}
								</div>
						}
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	publicGroup: state.publicGroup,
	globals: state.globals
});
export default withRouter(connect(mapStateToProps, actionCreators)(AddGroup));
