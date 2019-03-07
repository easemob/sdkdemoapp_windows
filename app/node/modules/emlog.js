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
     * @param {String} info
     */
    this.Log = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Log(info);
    };
    /**
     * output Debug log
     * @param {String} info
     */
    this.Debug = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Debug(info);
    };
    /**
     * output Warn log
     * @param {String} info
     */
    this.Warn = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Warn(info);
    };
    /**
     * output Error log
     * @param {String} info
     */
    this.Error = function(info){
        if(this._isDisplayOnConsole)
          console.log(info);
        log.Error(info);
    };
    /**
     * set log level
     * @param {Number} level
     */
    this.setLogLevel = function(level){
        log.setLogLevel(level);
    };
    /**
     * get log level
     * @return {Number}
     */
    this.getLogLevel = function(level){
        return log.getLogLevel();
    };
    /**
     * set weather display on console
     * @param {Bool} isDisplayOnConsole
     */
    this.setIsDisplayOnConsole = function(isDisplayOnConsole){
        this._isDisplayOnConsole = isDisplayOnConsole;
    };
    /**
     * get weather display on console
     * @return {Bool}
     */
    this.getIsDisplayOnConsole = function(){
        return this._isDisplayOnConsole;
    }

}

module.exports = EMLog;
