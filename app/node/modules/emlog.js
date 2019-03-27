const easemobNode = require('./../load');
const log = new easemobNode.EMLog();

/**
 * EMLog constructor.
 * @constructor
 * @param {Object} manager
 */
function EMLog(){
    this._isDisplayOnConsole = false;
    /**
     * output log
     * @param {String} info 日志信息
     */
    this.Log = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Log(info);
    };
    /**
     * output Debug log
     * @param {String} info 日志信息
     */
    this.Debug = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Debug(info);
    };
    /**
     * output Warn log
     * @param {String} info 日志信息
     */
    this.Warn = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Warn(info);
    };
    /**
     * output Error log
     * @param {String} info 日志信息
     */
    this.Error = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Error(info);
    };
    /**
     * set log level
     * @param {Number} level 日志等级
     */
    this.setLogLevel = function(level){
        log.setLogLevel(level);
    };
    /**
     * get log level
     * @return {Number} 返回日志等级
     */
    this.getLogLevel = function(level){
        return log.getLogLevel();
    };
    /**
     * set weather display on console
     * @param {Bool} isDisplayOnConsole 日志是否输出到控制台
     */
    this.setIsDisplayOnConsole = function(isDisplayOnConsole){
        this._isDisplayOnConsole = isDisplayOnConsole;
    };
    /**
     * get weather display on console
     * @return {Bool} 返回日志是否输出到控制台
     */
    this.getIsDisplayOnConsole = function(){
        return this._isDisplayOnConsole;
    }
    /**
     * 添加日志回调
     * @param {function} callback 日志回调函数
     */
    this.addLogCallback = function(callback){
        log.addLogCallback(callback);
    }
    /**
     * 删除日志回调
     * @param {function} callback 日志回调函数
     */
    this.removeLogCallback = function(callback){
        log.removeLogCallback(callback);
    }

}

module.exports = EMLog;
