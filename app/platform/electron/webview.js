import contextMenu from "./contextmenu";
import Lang from "../../lang";

const SELECT_MENU = contextMenu.createContextMenu([
	{ role: "copy", label: Lang.string("menu.copy") },
	{ type: "separator" },
	{ role: "selectall", label: Lang.string("menu.selectAll") }
]);

const INPUT_MENU = contextMenu.createContextMenu([
	{ role: "undo", label: Lang.string("menu.undo") },
	{ role: "redo", label: Lang.string("menu.redo") },
	{ type: "separator" },
	{ role: "cut", label: Lang.string("menu.cut") },
	{ role: "copy", label: Lang.string("menu.copy") },
	{ role: "paste", label: Lang.string("menu.paste") },
	{ type: "separator" },
	{ role: "selectall", label: Lang.string("menu.selectAll") }
]);

const initWebview = (webview) => {
	const webContents = webview.getWebContents();
	if(webContents){
		webContents.on("context-menu", (e, props) => {
			const { selectionText, isEditable } = props;
			if(isEditable){
				contextMenu.popupContextMenu(INPUT_MENU, e.clientX, e.clientY);
			}
			else if(selectionText && selectionText.trim() !== ""){
				contextMenu.popupContextMenu(SELECT_MENU, e.clientX, e.clientY);
			}
		});
	}
};

export default {
	initWebview,
};
