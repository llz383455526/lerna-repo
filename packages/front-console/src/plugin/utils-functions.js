let formatTime = (time, format = 'yyyy-MM-dd hh:mm:ss') => {
    if (!time) return ''

    time = new Date(time)

    let o = {
        'M+': time.getMonth() + 1, //月份
        'd+': time.getDate(), //日
        'h+': time.getHours(), //小时
        'm+': time.getMinutes(), //分
        's+': time.getSeconds(), //秒
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度
        'S': time.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr(('' + o[k]).length)))
        }
    }
    return format
}

/** 
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
let urlEncode = (param, key, encode) => {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

// 获取浏览器信息
let getBrowserInfo = () => {
    const sys = {}
    const ua = navigator.userAgent.toLowerCase()
    const re = /(msie|firefox|chrome|opera|version|rv).*?([\d.]+)/
    const m = ua.match(re)
    sys.browser = m[1].replace(/version/, "'safari")
    // 兼容IE11
    sys.browser = m[1].replace(/rv/, "'msie")
    // eslint-disable-next-line prefer-destructuring
    sys.ver = m[2]
    return sys
}

// 获取当前日期
const getCurrentDate = function () {
    return new Date();
}


// 获得本周起止时间
const getCurrentWeek = () => {
    //起止日期数组
    var startStop = new Array();
    //获取当前时间
    var currentDate = getCurrentDate();
    //返回date是一周中的某一天
    var week = currentDate.getDay();
    //返回date是一个月中的某一天
    var month = currentDate.getDate();

    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //减去的天数
    var minusDay = week != 0 ? week - 1 : 6;
    //alert(minusDay);
    //本周 周一
    var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    //本周 周日
    var sunday = new Date(monday.getTime() + (6 * millisecond));
    //添加本周时间
    startStop.push(monday); //本周起始时间
    //添加本周最后一天时间
    startStop.push(sunday); //本周终止时间
    //返回
    return startStop;
}

const getLastWeek = () => {
    //起止日期数组
    var startStop = new Array();
    //获取当前时间
    var currentDate = getCurrentDate();
    //返回date是一周中的某一天
    var week = currentDate.getDay();

    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //减去的天数
    var minusDay = (week != 0 ? week - 1 : 6) + 7;
    // alert(minusDay);
    //上周 周一
    var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
    //上周 周日
    var sunday = new Date(monday.getTime() + (6 * millisecond));
    //添加上周时间
    startStop.push(monday); //上周起始时间
    //添加上周最后一天时间
    startStop.push(sunday); //上周终止时间
    //返回
    return startStop;
}



// 获得本月的起止时间  
const getCurrentMonth = function () {
    //起止日期数组    
    var startStop = new Array();
    //获取当前时间    
    var currentDate = getCurrentDate();
    //获得当前月份0-11    
    var currentMonth = currentDate.getMonth();
    //获得当前年份4位年    
    var currentYear = currentDate.getFullYear();
    //求出本月第一天    
    var firstDay = new Date(currentYear, currentMonth, 1);
    //当为12月的时候年份需要加1    
    //月份需要更新为0 也就是下一年的第一个月    
    if (currentMonth == 11) {
        currentYear++;
        currentMonth = 0; //就为    
    } else {
        //否则只是月份增加,以便求的下一月的第一天    
        currentMonth++;
    }

    var millisecond = 1000 * 60 * 60 * 24;
    //下月的第一天    
    var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
    //求出上月的最后一天    
    var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);
    //添加至数组中返回    
    startStop.push(firstDay);
    startStop.push(lastDay);
    //返回    
    return startStop;
};

// 获得本月的起止时间  
const getLastMonth = function () {
    //起止日期数组    
    var startStop = new Array();
    //获取当前时间    
    var currentDate = getCurrentDate();
    //获得当前月份0-11    
    var currentMonth = currentDate.getMonth();
    //获得当前年份4位年    
    var currentYear = currentDate.getFullYear();

    var millisecond = 1000 * 60 * 60 * 24;

    //本月第一天
    var currentMonthDayOne = new Date(currentYear, currentMonth, 1);
    // 上月的最后一天
    var lastDay = new Date(currentMonthDayOne.getTime() - millisecond);
    //当为1月的时候年份需要减1
    //月份需要更新为12
    if (currentMonth == 0) {
        currentYear--;
        currentMonth = 11;
    } else {
        //否则只是月份增加,以便求的下一月的第一天
        currentMonth--;
    }

    //求出上月的第一一天
    var firstDay = new Date(currentYear, currentMonth, 1);
    //添加至数组中返回
    startStop.push(firstDay);
    startStop.push(lastDay);
    //返回
    return startStop;
};

// 去除json中的空值
const deleteEmptyProperty = function (data) {
    let y
    for (let x in data) {
        y = data[x]
        if (y instanceof Object) y = deleteEmptyProperty(y)
        if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
            delete data[x]
        }
    }
    return data
}


export {
    formatTime,
    urlEncode,
    getBrowserInfo,
    getCurrentWeek,
    getLastWeek,
    getCurrentMonth,
    getLastMonth,
    deleteEmptyProperty,
}