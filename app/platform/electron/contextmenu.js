import { remote } from "electron";
import ui from "./ui";

const Menu = remote.Menu;

const createContextMenu = (menu) => {
	if(Array.isArray(menu) && !menu.popup){
		menu = Menu.buildFromTemplate(menu);
	}
	return menu;
};

const popupContextMenu = (menu, x, y, browserWindow) => {
	if(typeof x === "object"){
		y = x.clientY;
		x = x.clientX;
	}
	menu = createContextMenu(menu);
	menu.popup(browserWindow || ui.browserWindow, x, y);
};

export default {
	createContextMenu,
	popupContextMenu
};
