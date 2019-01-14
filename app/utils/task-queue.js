import Status from './status';
import timeSequence from './time-sequence';

const STATUS = new Status({
    wait: 0,
    pending: 1,
    // paused: 2,
    done: 2,
    canceled: 3
}, 0);

class TaskQueue {
    constructor(tasks, onTask, onTaskStart) {
        this._tasks = [];
        this._finished = [];
        this._status = STATUS.create();
        this._runId = 0;
        this._onTask = onTask;
        this._onTaskStart = onTaskStart;
        this._running = 0;

        if (tasks) {
            this.add(tasks);
        }

        this._status.onChange = (status, oldStatus) => {
            if (this._onStatusChange) {
                this._onStatusChange(status, oldStatus);
            }
        };
    }

    get onTaskStart() {
        return this._onTaskStart;
    }

    set onTaskStart(callback) {
        this._onTaskStart = callback;
    }

    get onTask() {
        return this._onTask;
    }

    set onTask(callback) {
        this._onTask = callback;
    }

    get onStatusChange() {
        return this._onStatusChange;
    }

    set onStatusChange(callback) {
        this._onStatusChange = callback;
    }

    get runId() {
        return this._runId;
    }

    get taskCount() {
        return this._tasks.length;
    }

    get finishCount() {
        return this._finished.length;
    }

    get totalCount() {
        return this._tasks.length + this._finished.length;
    }

    get statusValue() {
        return this._status.value;
    }

    get statusName() {
        return this._status.name;
    }

    get isRunning() {
        return this._status.is(STATUS.pending);
    }

    get isWait() {
        return this._status.is(STATUS.wait);
    }

    get percent() {
        return this.finishCount / this.totalCount;
    }

    add(...tasks) {
        for (let task of tasks) {
            if (Array.isArray(task)) {
                this.add(...task);
            } else {
                this._tasks.push(task);
            }
        }
    }

    cancel() {
        if (this.isRunning) {
            this._status.change(STATUS.canceled);
            this._runId = 0;
        }
        return this;
    }

    runTask(task, ...params) {
        const taskFunc = (typeof task === 'object' && task.func) ? task.func : task;
        if (this._onTaskStart) {
            this._onTaskStart(task, this.percent, this);
        }
        const result = taskFunc(...params);
        if (result instanceof Promise) {
            return result;
        }
        return Promise.resolve(result);
    }

    next(runId, resolve, reject, ...params) {
        const task = this._tasks[0];
        this.runTask(task, ...params).then(result => {
            if (runId === this._runId) {
                this._finished.push(this._tasks.shift());
                if (this._onTask) {
                    this._onTask(result, task, this.percent, this);
                }
                if (!this._tasks.length) {
                    this._status.change(STATUS.done);
                    resolve(this._finished.length);
                } else if (this.isRunning) {
                    if (result !== undefined) {
                        params.push(result);
                    }
                    this.next(runId, resolve, reject, ...params);
                }
            } else {
                reject('canceled');
            }
        }).catch(reject);
    }

    run(...params) {
        if (!this._tasks.length) {
            return Promise.resolve(0);
        }
        if (!this.isWait) {
            const errorMessage = `The status is not wait(current '${this.statusName}')`;
            if (DEBUG) {
                console.error(errorMessage, this);
            }
            return Promise.reject(errorMessage);
        }
        return new Promise((resolve, reject) => {
            const runId = timeSequence();
            this._runId = runId;
            this._status.change(STATUS.pending);
            this.next(runId, resolve, reject, ...params);
        });
    }

    reset() {
        this.cancel();
        this._status.change(STATUS.wait);
        this._tasks.push(...this._finished);
        this._finished = [];
        return this;
    }
}

export default TaskQueue;
