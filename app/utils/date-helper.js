import StringHelper from './string-helper';

const TIME_DAY = 24 * 60 * 60 * 1000;

const createDate = date => {
    if (!(date instanceof Date)) {
        if (typeof date === 'number' && date < 10000000000) {
            date *= 1000;
        }
        date = new Date(date);
    }
    return date;
};

const createPhpTimestramp = date => {
    return Math.floor(createDate(date) / 1000);
};

const isSameDay = (date1, date2) => {
    if (!date2) {
        date2 = new Date();
    }
    date1 = createDate(date1);
    date2 = createDate(date2);
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

const isSameYear = (date1, date2) => {
    if (!date2) {
        date2 = new Date();
    }
    return createDate(date1).getFullYear() === createDate(date2).getFullYear();
};

const isSameMonth = (date1, date2) => {
    if (!date2) {
        date2 = new Date();
    }
    date1 = createDate(date1);
    date2 = createDate(date2);
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const isToday = (date, now) => (isSameDay(now || new Date(), date));

const isYestoday = (date, now) => (isSameDay((now || new Date()).getTime() - TIME_DAY, date));

const formatDate = (date, format = 'yyyy-MM-dd hh:ss') => {
    date = createDate(date);

    let dateInfo = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        // 'H+': date.getHours() % 12,
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        // 'q+': Math.floor((date.getMonth() + 3) / 3),
        'S+': date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    Object.keys(dateInfo).forEach(k => {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? dateInfo[k] : ('00' + dateInfo[k]).substr(('' + dateInfo[k]).length));
        }
    });
    return format;
};

const formatSpan = (date1, date2, format) => {
    format = Object.assign({full: 'yyyy-M-d', month: 'M-d', day: 'd', str: '{0} ~ {1}'}, format);
    const date1Str = formatDate(date1, isSameYear(date1) ? format.month : format.full);
    if (isSameDay(date1, date2)) {
        return date1Str;
    }
    const date2Str = formatDate(date2, isSameYear(date1, date2) ? (isSameMonth(date1, date2) ? format.day : format.month) : format.full);
    return StringHelper.format(format.str, date1Str, date2Str);
};

const getTimeBeforeDesc = desc => {
    const now = new Date().getTime();
    switch (desc) {
    case 'oneWeek':
        return now - (TIME_DAY * 7);
    case 'oneMonth':
        return now - (TIME_DAY * 31);
    case 'threeMonth':
        return now - (TIME_DAY * 31 * 3);
    case 'halfYear':
        return now - (TIME_DAY * 183);
    case 'oneYear':
        return now - (TIME_DAY * 365);
    case 'twoYear':
        return now - (2 * (TIME_DAY * 365));
    default:
        return 0;
    }
};

export default {
    createDate,
    formatDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    isToday,
    isYestoday,
    formatSpan,
    getTimeBeforeDesc,
    createPhpTimestramp
};
