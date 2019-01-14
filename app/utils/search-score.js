const calcConditionScore = (condition, key, obj) => {
    let score = 0;
    let source = obj[condition.name];
    if (source === undefined || source === null) {
        return score;
    }
    if (typeof source === 'number') {
        source = `${source}`;
    }
    let searchKey = key;
    if (condition.prefix) {
        if (key.startsWith(condition.prefix) && key.length > condition.prefix.length) {
            const cIndex = key.lastIndexOf('(');
            if (key[key.length - 1] === ')' && cIndex > -1) {
                searchKey = key.substring(cIndex + 1, key.length - 1);
            } else {
                searchKey = key.substr(condition.prefix.length);
            }
        } else {
            return score;
        }
    }
    if (condition.array) {
        let arrayMatchCount = 0;
        source.forEach(item => {
            const itemSource = item.trim().toLowerCase();
            if (condition.equal && itemSource === searchKey) {
                score += condition.equal;
                arrayMatchCount += 1;
            } else if (condition.include && itemSource.includes(searchKey)) {
                score += condition.include;
                arrayMatchCount += 1;
            }
        });
        if (arrayMatchCount < source.length) {
            score /= 2;
        }
    } else {
        const sourceValue = source.trim().toLowerCase();
        if (condition.equal && sourceValue === searchKey) {
            score += condition.equal;
        } else if (condition.include && sourceValue.includes(searchKey)) {
            score += condition.include;
        }
    }
    return score;
};

/**
 * Get search match score from conditions and keys
 *
 * @example <caption>A conditions can be like this:</caption>
 * const conditions = [
 *     {name: 'name', equal: 100, include: 50},
 *     {name: 'displayName', equal: 100, include: 50},
 *     {name: 'description', include: 25},
 *     {name: 'keywords', equal: 50, include: 10, array: true},
 *     {name: 'type', equal: 100, prefix: ':'},
 *     {name: 'author', equal: 100, prefix: '@'},
 *     {name: 'publisher', equal: 100, prefix: '@'},
 *     {name: 'homepage', include: 25},
 * ];
 *
 * @param {Array} conditions
 * @param {Array[String]} keys
 */
const matchScore = (conditions, obj, keys) => {
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    if (!Array.isArray(conditions)) {
        conditions = [conditions];
    }
    let score = 0;
    let matchCount = 0;

    keys.forEach(key => {
        if (key === undefined || key === null || !key.length) {
            return;
        }
        conditions.forEach(condition => {
            const conditionScore = calcConditionScore(condition, key, obj);
            if (conditionScore) {
                matchCount += 1;
                score += conditionScore;
            }
        });
    });

    if (matchCount !== keys.length) {
        score /= 2;
    }
    return score;
};

export default {matchScore};
