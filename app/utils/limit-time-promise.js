/**
 * Create a limit time promise
 *
 * @param {Promise} promise
 * @param {number} timeout
 * @param {string|Error} timeoutError
 */
export default (promise, timeout = 15000, timeoutError = 'TIMEOUT') => {
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(timeoutError);
        }, timeout);
    });

    return Promise.race([promise, timeoutPromise]);
};
