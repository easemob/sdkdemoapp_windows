export default class DelayAction {
    constructor(action, delay = 100, callback = null) {
        this.action = action;
        this.delay = delay;
        this.callback = callback;
        this.done = true;
    }

    do(...params) {
        this.done = false;
        if (this.actionCallTask) {
            clearTimeout(this.actionCallTask);
        }
        this.actionCallTask = setTimeout(() => {
            this.doIm(...params);
        }, this.delay);
    }

    doIm(...params) {
        const actionResult = this.action(...params);
        this.actionCallTask = null;
        if (typeof this.callback === 'function') {
            this.callback(actionResult);
        }
        this.done = true;
    }

    get isDone() {
        return this.done;
    }

    destroy() {
        clearTimeout(this.actionCallTask);
    }
}
