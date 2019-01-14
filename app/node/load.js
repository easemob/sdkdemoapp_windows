var easemobNode;
if(process.platform !== "darwin"){
	easemobNode = require("./../easemob/easemobWin.node");
}
else{
	easemobNode = require("./../easemob/easemobMac.node");
}

export default easemobNode;