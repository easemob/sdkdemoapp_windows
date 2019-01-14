const easemobNode = require('./../load');
const log = new easemobNode.EMLog();

function EMLog(){
    //log输出
    this.Log = function(info){
        log.Log(info);
    };
    //debug等级日志输出
    this.Debug = function(info){
        log.Debug(info);
    };
    //warn等级日志输出
    this.Warn = function(info){
        log.Warn(info);
    };
    //error等级日志输出
    this.Error = function(info){
        log.Error(info);
    };
    //设置日志等级，0为debug，1为warn,2为error
    this.setLogLevel = function(level){
        log.setLogLevel(level);
    };
    //获取日志等级
    this.getLogLevel = function(level){
        return log.getLogLevel();
    };
}

module.exports = EMLog;
