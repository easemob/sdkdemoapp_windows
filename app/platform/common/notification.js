import Config from "Config";

const createNotification = (title, options, onClick) => {
	if(typeof title === "object"){
		options = title;
		title = options.title;
		delete options.title;
	}
	if(!onClick && options){
		onClick = options.click;
	}
	const notification = new Notification(title, Object.assign({
		icon: `${Config.media["image.path"]}icon.png`
	}, options));
	if(onClick){
		notification.onclick = onClick;
	}
	return notification;
};

const showNotification = (title, options, onClick) => {
	if(Notification.permission === "granted"){
		return Promise.resolve(createNotification(title, options, onClick));
	}
	if(Notification.permission !== "denied"){
		return new Promise((resolve, reject) => {
			Notification.requestPermission((permission) => {
				if(permission === "granted"){
					resolve(createNotification(title, options, onClick));
				}
				else{
					reject("denied");
				}
			});
		});
	}
	return Promise.reject("denied");
};

export default {
	show: showNotification
};
