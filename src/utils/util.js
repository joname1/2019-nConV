/**
 * 确保一个日期值，如果不是日期值，则尝试转换为日期值。
 *
 * @param {*} date - 原日期值。
 * @returns 确保后的日期值。
 */
function ensureDate (date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }
    return date;
}

/**
 * 对日期进行格式化，
 * @param {Date} date - 要格式化的日期
 * @param {string} format - 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return 格式化后的日期字符串。
 */
function dateFormat (date, format) {
    if (format === undefined) {
        format = date;
        date = ensureDate();
    }

    date = ensureDate(date);

    let map = {
        'M': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 小时
        'm': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    let repReg = new RegExp('([yMdhmsqS])+', 'g');
    format = format.replace(repReg, function (all, t) {
        let v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substring(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            let tmpVal = date.getFullYear() + '';
            return tmpVal.substring(4 - all.length);
        }
        return all;
    });
    return format;
}

export {
    dateFormat
}