
class StatusKeeper {
    constructor(status, mapper) {
        this.mapper = mapper;
        this.status = mapper.getValue(status);
        if (this.status === undefined) {
            this.status = mapper.defaultValue;
        }
    }

    get name() {
        return this.mapper.getName(this.status);
    }

    get value() {
        return this.mapper.getValue(this.status);
    }

    get onChange() {
        return this._onChange;
    }

    set onChange(callback) {
        this._onChange = callback;
    }

    get canChange() {
        return this._canChange;
    }

    set canChange(callback) {
        this._canChange = callback;
    }

    change(nameOrValue) {
        const value = this.mapper.getValue(nameOrValue);
        const oldValue = this.value;
        if (value !== undefined && oldValue !== value) {
            if (!this._canChange || this._canChange(value, oldValue)) {
                this.status = value;
                if (typeof this._onChange === 'function') {
                    this._onChange(value, oldValue, this);
                }
            } else if (DEBUG) {
                console.error(`Status '${oldValue}' cannot change to ${nameOrValue} with the rule.`);
            }
        }
    }

    is(nameOrValue) {
        const value = this.mapper.getValue(nameOrValue);
        return value !== undefined && value === this.status;
    }
}

export default class Status {
    constructor(statuses, defaultStatus) {
        this.$values = {};
        Object.keys(statuses).forEach(name => {
            if (typeof this[name] !== 'undefined') {
                throw new Error(`Cannot create status object, the name '${name}' is not a valid status name.`);
            }
            const value = statuses[name];
            if (typeof value !== 'number') {
                throw new Error(`Cannot create status object, the status value(${value}) must be a number.`);
            }
            this.$values[value] = name;
            this[name] = value;
        });

        if (defaultStatus !== undefined) {
            this.defaultStatus = this.getValue(defaultStatus);
        }
        if (this.defaultStatus === undefined) {
            this.defaultStatus = this.values[0];
        }
    }

    get names() {
        return Object.values(this.$values);
    }

    get values() {
        return Object.keys(this.$values);
    }

    get defaultName() {
        return this.getName(this.defaultStatus);
    }

    get defaultValue() {
        return this.getValue(this.defaultStatus);
    }

    getName(valueOrName, defaultName) {
        let name;
        if (typeof valueOrName === 'number') {
            name = this.$values[valueOrName];
        } else if (this[valueOrName] !== undefined) {
            name = valueOrName;
        }
        return name === undefined ? defaultName : name;
    }

    getValue(valueOrName, defaultValue) {
        let value;
        if (typeof valueOrName === 'string') {
            value = this[valueOrName];
        } else if (this.$values[valueOrName] !== undefined) {
            value = valueOrName;
        }
        return value === undefined ? defaultValue : value;
    }

    isSame(status1, status2) {
        return this.getValue(status1) === this.getValue(status2);
    }

    /**
     * Create a status keeper instance
     *
     * @param {any} status
     * @returns {StatusKeeper}
     * @memberof Status
     */
    create(status) {
        if (status === undefined) {
            status = this.defaultValue;
        }
        return new StatusKeeper(status, this);
    }

    static Keeper = StatusKeeper;
}
