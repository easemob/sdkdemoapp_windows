import Store from "../../utils/store";
import plainObject from "../../utils/plain";

const KEY_USER_PREFIX = "USER::";
const KEY_USER_LIST = "USER_LIST";

const allUsers = () => {
	return Store.get(KEY_USER_LIST, {});
};

const getUser = (identify) => {
	if(identify){
		const user = Store.get(`${KEY_USER_PREFIX}${identify}`);
		if(user){
			user.identify = identify;
			if(user.rememberPassword === undefined){
				user.rememberPassword = true;
			}
		}
		return user;
	}
	const users = allUsers();
	if(!users){
		return null;
	}
	let maxTime = 0;
	let maxTimeIndentify = null;
	Object.keys(users).forEach((identify) => {
		const time = users[identify];
		if(time > maxTime){
			maxTime = time;
			maxTimeIndentify = identify;
		}
	});
	return maxTimeIndentify ? getUser(maxTimeIndentify) : null;
};

const userList = () => {
	const users = allUsers();
	return Object.keys(users).map(getUser).sort((x, y) => y.lastLoginTime - x.lastLoginTime);
};

const saveUser = (user) => {
	const identify = user.identify;
	if(!identify){
		throw new Error("Cannot save user, because user.indentify property is not defined.");
	}

	const userData = typeof user.plain === "function" ? user.plain() : plainObject(user);
	if(!userData.rememberPassword){
		delete userData.password;
	}

	Store.set(`${KEY_USER_PREFIX}${identify}`, userData);

	const users = allUsers();
	users[identify] = new Date().getTime();
	Store.set(KEY_USER_LIST, users);
};

const removeUser = (user) => {
	const identify = typeof user === "object" ? user.identify : user;

	if(!identify){
		throw new Error("Cannot remove user, because user.indentify property is not defined.");
	}

	Store.remove(`${KEY_USER_PREFIX}${identify}`);

	const users = allUsers();
	if(users[identify]){
		delete users[identify];
		Store.set(KEY_USER_LIST, users);
	}
};

export default {
	allUsers,
	getUser,
	userList,
	saveUser,
	removeUser,
	store: Store
};
