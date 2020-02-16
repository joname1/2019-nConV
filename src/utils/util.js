//数组计算总和
function calcSum(arr) {
    var len = arr.length;
    if (len === 0) {
        return 0;
    } else if (len === 1) {
        return arr[0];
    } else {
        return arr[0] + calcSum(arr.slice(1));
    }
}

//千位数加逗号
function NumberComma(data) {
    return data.toString().replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
}

//确保传过来是否正确时间
function ensureDate (date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }
    return date;
}

//时间戳转正常时间
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

//JSON归类
function normalize(data) {
    let moth = [],
        flag = 0,
        list = data;
    let dataInfo = {
        title: "",
        province: ""
    };

    for (let i = 0; i < list.length; i++) {
        let az = "";
        for (let j = 0; j < moth.length; j++) {
            if (moth[j].title === list[i]["Country_Region"]) {
                flag = 1;
                az = j;
                break;
            }
        }
        if (flag === 1) {
            let ab = moth[az];
            ab.Province.push({
                name: list[i].Province_State || list[i].Country_Region,
                value: list[i].Confirmed,
                lng: String(list[i].Long_),
                lat: String(list[i].Lat)
            });
            flag = 0;
        } else if (flag === 0) {
            dataInfo = {};
            dataInfo.title = list[i]["Country_Region"];
            dataInfo.Province = new Array();
            dataInfo.Province.push({
                name: list[i].Province_State || list[i].Country_Region,
                value: list[i].Confirmed,
                lng: String(list[i].Long_),
                lat: String(list[i].Lat)
            });
            moth.push(dataInfo);
        }
    }

    return moth;
}
export {
    dateFormat,
    NumberComma,
    calcSum,
    normalize
}