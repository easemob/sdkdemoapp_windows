import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "@/stores/actions";
import * as selectors from "@/stores/selectors";
import { Menu, Checkbox } from "antd";
import HeadImageView from "@/views/common/head_image";
import _ from "underscore";


class ContactGroupMemberView extends PureComponent {

	constructor(props){
		super(props);
		const { operate } = this.props;
		this.operate = operate;
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	handleOnChange(e, item){
		const { selectDelMembersAction, selectVideoMembersAction, cancelDelMembersAction, cancelVideoMembersAction  } = this.props;
		if(e.target.checked){
			switch(this.operate){
			case "delGroupMember":
				selectDelMembersAction(item);
				break;
			case "videoCall":
				selectVideoMembersAction(item);
				break;
			default:
				break;
			}
		}
		else{
			switch(this.operate){
			case "delGroupMember":
				cancelDelMembersAction(item);
				break;
			case "videoCall":
				cancelVideoMembersAction(item);
				break;
			default:
				break;
			}
		}
	}

	//
	showCheckbox(member){
		const { userInfo, selectConversationId, selectMemberData = [] } = this.props;
		// userInfo.user.easemobName == item.easemobName ||
		// selectConversationId == item.easemobName
		// 	? <Checkbox checked={ true } ></Checkbox>
		// 	: <Checkbox onChange={ e => this.handleOnChange(e, item) } ></Checkbox>
		var isSelected = _.filter(selectMemberData, (item) => {
			return item == member.easemobName;
		});
		return (
			<Checkbox
				checked={
					!!(userInfo.user.easemobName == member.easemobName ||
				isSelected.length)
				}
				onChange={
					userInfo.user.easemobName == member.easemobName ||
					selectConversationId == member.easemobName
						? e => null
						: e => this.handleOnChange(e, member)
				}
			></Checkbox>
		);
	}

	render(){
		const { dataList, allMembersInfo } = this.props;
		var memberInfoOfGroup;
		return (
			<div className="member-list">
				<Menu>
					{
						_.map(dataList, (item) => {
							memberInfoOfGroup = allMembersInfo[item];
							return (
								<Menu.Item key={ item }>
									<div className="avatar-name">
										<HeadImageView imgUrl={ memberInfoOfGroup ? memberInfoOfGroup.image : "" } />
										{
											memberInfoOfGroup
												? memberInfoOfGroup.realName || memberInfoOfGroup.username || memberInfoOfGroup.easemobName
												: item
										}
									</div>
									{
										this.showCheckbox(memberInfoOfGroup)
									}
								</Menu.Item>
							);
						})
					}
				</Menu>
			</div>
		);

	}
}
const mapStateToProps = state => ({
	members: selectors.getAllMembers(state),
	userInfo: state.userInfo,
	selectConversationId: state.selectConversationId,
	// membersOfCreateGroup: state.membersOfCreateGroup,
	groupChats: state.groupChats,
	allMembersInfo: state.allMembersInfo
});
export default connect(mapStateToProps, actionCreators)(ContactGroupMemberView);
