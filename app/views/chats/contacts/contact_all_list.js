/* 添加群成员、创建群、快捷创建群列表*/
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import { Menu, Checkbox, Input } from "antd";
import HeadImageView from "@/views/common/head_image";
import _ from "underscore";
import api from "@/api";
import { utils } from "@/utils/utils";
const Search = Input.Search;
var latest = utils.latestFunc();

class ContactView extends PureComponent {

	constructor(props){
		super(props);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleChangeSearchVal = this.handleChangeSearchVal.bind(this);
		this.searchValue = "";
	}

	handleOnChange(e, item){
		const { selectMembersAction, cancelMembersAction  } = this.props;
		if(e.target.checked){
			selectMembersAction(item);
		}
		else{
			cancelMembersAction(item.easemobName);
		}
	}

	handleChangeSearchVal(e){
		const { userInfo, searchMember } = this.props;
		this.searchValue = e.target.value;
		api.searchMember(userInfo.user.tenantId, e.target.value)
		.done(latest(function(dataSource){
			var members = {};
			_.map(dataSource.data, (member) => {
				if(member.easemobName){
					members[member.easemobName] = member;
				}
			});
			// return members || [];
			searchMember(members);
		}));
	}

	//
	showCheckbox(memberInfo){
		const {
			selectMemberData = [],	// 编辑时选择的人
			groupMemberData = [],	// 这个群固定的人，不能编辑
		} = this.props;
		var isSelected;
		var selectMemberEasemobnameData = [];
		var isEditSelector;

		_.map(selectMemberData.concat(groupMemberData), function(member){
			selectMemberEasemobnameData.push(member);
		});
		isSelected = selectMemberEasemobnameData.indexOf(memberInfo.easemobName);
		isEditSelector = _.filter(groupMemberData, function(item){
			return item == memberInfo.easemobName;
		});
		return (
			<Checkbox
				checked={
					!!(isSelected > -1)
				}
				onChange={
					isEditSelector.length
						? e => null		// e 不能删除会报错
						: e => this.handleOnChange(e, memberInfo)
				}
			></Checkbox>
		);
	}

	render(){
		const { allMembersInfo, searchMembers } = this.props;
		var concatList;
		var activeAllMembers = _.filter(allMembersInfo, (item) => { return item.easemobName; });
		activeAllMembers = _.sortBy(activeAllMembers, "username");
		concatList = this.searchValue ? _.values(searchMembers) : activeAllMembers;
		concatList = concatList.splice(0, 300);
		return (
			<div>
				<Search
					placeholder="搜索"
					// onSearch={ value => this.handleSearch(value) }
					onChange={ e => this.handleChangeSearchVal(e) }
					style={ { width: 250 } }
				/>
				<div className="member-list">
					<Menu>
						{
							_.map(concatList, (item) => {
								return (
									<Menu.Item key={ item.easemobName }>
										<div className="avatar-name">
											<HeadImageView imgUrl={ item.image } />
											{item.realName || item.username || item.easemobName}
										</div>
										{
											this.showCheckbox(item)
										}
									</Menu.Item>
								);
							})
						}
					</Menu>
				</div>
			</div>
		);

	}
}
const mapStateToProps = state => ({
	globals: state.globals,
	userInfo: state.userInfo,
	selectConversationId: state.selectConversationId,
	groupChats: state.groupChats,
	searchMembers: state.searchMemberOfCreateGroup,
	allMembersInfo: state.allMembersInfo,
	// membersOfCreateGroup: state.membersOfCreateGroup,
	// groupMembers: selectors.getGroupMembers(state),
});
export default connect(mapStateToProps, actionCreators)(ContactView);
