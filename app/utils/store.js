const storage = window.localStorage;

const serialize = value => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
};

const deserialize = value => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (ignore) {}
    }
    return value;
};

const setItem = (key, value) => {
    storage.setItem(key, serialize(value));
};

const getItem = (key, defaultValue) => {
    const val = deserialize(storage.getItem(key));
    return val === null ? defaultValue : val;
};

const remove = key => {
    storage.removeItem(key);
};

const clear = () => {
    storage.clear();
};

const getLength = () => {
    return storage.length;
};

const forEach = callback => {
    const length = getLength();
    for (let i = 0; i < length; ++i) {
        const key = storage.key(i);
        if (callback) {
            callback(getItem(key), key, i);
        }
    }
};

const getAll = () => {
    const all = {};
    forEach((value, key) => {
        all[key] = value;
    });
    return all;
};

export default {
    set: setItem,
    get: getItem,
    remove,
    clear,
    forEach,
    get length() {
        return getLength();
    },
    get all() {
        return getAll();
    }
};
