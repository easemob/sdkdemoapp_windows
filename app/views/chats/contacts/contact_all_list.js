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
			selectMembersAction({"easemobName":item});
		}
		else{
			cancelMembersAction(item);
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
		isSelected = selectMemberEasemobnameData.indexOf(memberInfo);
		isEditSelector = _.filter(groupMemberData, function(item){
			return item == memberInfo;
		});
		console.log("selectMemberEasemobnameData:" + selectMemberEasemobnameData);
		console.log("memberInfo:" + memberInfo);
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
		const { allContacts } = this.props;
		var concatList = allContacts.contacts;
		return (
			<div>
				<div className="member-list">
					<Menu>
						{
							_.map(concatList, (item) => {
								return (
									<Menu.Item key={ item }>
										<div className="avatar-name">
											<HeadImageView imgUrl={ item.image } />
											{item}
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
	searchMembers: state.searchMemberOfCreateGroup,
	allMembersInfo: state.allMembersInfo,
	allContacts: state.allContacts,
	membersOfCreateGroup: state.membersOfCreateGroup
});
export default connect(mapStateToProps, actionCreators)(ContactView);
