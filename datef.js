/**
 * 格式化日期, 类似php的date函数，具体使用方式请参考文档 
 * @see https://gitee.com/jinko/js-datef/blob/master/README.md
 * @see https://gitee.com/jinko/js-datef/blob/master/README.en.md
 * 
 * @param {String} format 字符串格式
 * 指定生成时间格式的字符串，例如 Y-m-d H:i:s 会生成类似 2020-12-12 09:30:00 的时间格式
 * 
 * @param {String|Date|Number|null} time 日期
 * 指定的时间或日期, 可以是时间戳（秒）、Date对象、字符串时间格式（如2020-12-21）
 * 若为空（null、undefined、false、空字符串）则取当前时间
 * 
 * @param {String} adjustments 调节器
 * 格式 [(prev|next) {weekname}](+|-){number}[y|m|d|h|i|s|w]
 * 例如 next monday + 2h
 * 
 * @returns {String}
 */
function datef(format, time, adjustments) {
    var targetDate = null;

    //检查format参数
    format = format ? format : 'Y-m-d H:i:s';

    var _typeof = function(v) {
        return Object.prototype.toString.call(v);
    };

    var type = {
        value: _typeof,

        STRING: _typeof(''),
        FUNCTION: _typeof(new Function),
        UNDEFINED: _typeof(undefined),

        isString: function (v) {
            return _typeof(v) === this.STRING;
        },

        isFunction: function (v) {
            return _typeof(v) === this.FUNCTION;
        },
        
        isUndefined: function (v) {
            return _typeof(v) === this.UNDEFINED;
        }
    };

    if(!type.isString(format)) {
        if(type.isFunction(format.toString)) {
            format = format.toString();
        } else {
            console.error("Invalid argument 1 \""+ format +"\" for datef()\n");
            return '';
        }
    }
    
    // 检查时间戳
    if(!time && time !== 0) {
        targetDate = new Date();
    } else if(time instanceof Date) {
        targetDate = time;
    } else if(typeof time == "number" || /^[0-9]+$/.test(String(time))) {
        targetDate = new Date(time*1000);
    } else {
        targetDate = new Date(time);

        if(isNaN(targetDate.getTime())) {
            console.error('Invalid argument 2 "'+ time +'" for datef()');
            return '';
        }
    }

    try {
        targetDate = adjust(targetDate, adjustments);
    } catch (e) {
        console.error(
            "Unrecognizable argument 3 \""+ adjustments +"\" for datef()\n" +
            (e ? "\n"+e : '') +
            "see https://gitee.com/jinko/js-datef/blob/master/README.md\n" +
            "https://gitee.com/jinko/js-datef/blob/master/README.en.md"
        );
        return '';
    }
    
    var
        year = targetDate.getFullYear(),
        month = targetDate.getMonth()+1,
        day = targetDate.getDate(),
        week = targetDate.getDay(),
        hour = targetDate.getHours(),
        min = targetDate.getMinutes(),
        sec = targetDate.getSeconds()
    ;
    
    function adjust(date, adjustments) {
        if(!adjustments || !type.isString(adjustments)) {
            return date;
        }
        
        adjustments = adjustments.toLowerCase().replace(/^\s+|\s+$/, '');
        var adjustSec = 0;
        var matched = adjustments.match(/^((?:next|prev)\s+)?((?:[a-z\-]+)\s*)?((?:[+\-]\s*(?:[0-9]+[ymdhisw]?\s*))*)$/);
        var weekSec = 0;
        var weekIndex = {
            monday: 1, mon:1,
            tuesday: 2, tue:2,
            wednesday: 3, wed:3,
            thursday: 4, thu:4,
            friday: 5, fri:5,
            saturday: 6, sat:6,
            sunday: 7, sun:7
        }
        
        if(matched[2]) {
            var day = weekIndex[matched[2]];
            
            if(type.isUndefined(day)) {
                throw "Invalid '"+ day +"'";
            }

            var curday = date.getDay();
            // curday = curday == 0 ? 7 : curday;
            var weekDay = curday - day;
            // weekDay = weekDay > 0 ? 7 - weekDay : -weekDay;
            weekSec = weekDay * 24 * 3600 * -1;
        }
        
        if(matched[1] == 'prev') {
            adjustSec -= weekSec
        }
        
        if(!matched) {
            throw "";
        }
        
        return date;
    }

    /**
     * 左边填充
     */
    function pad(str, char, count, right) {
        str = String(str);
        char = String(char)[0];
        count = count - str.length;

        if(count > 0) {
            if(right) {
                return str + String(char).repeat(count);
            } else {
                return String(char).repeat(count) + str;
            }
        } else {
            return str;
        }
    }

    /**
     * 是否闰年
     */
    function leep_year(y) {
        return (y % 4)==0 && ((y % 100)!=0) || ((y % 400)==0)
    }

    /**
     * 一月有多少天
     */
    function days_in_month(y, m)  {
        if(m == 2) {
            return leep_year(y) ? 29 : 28;
        }

        return -1 === [3,5,7,9,11].indexOf(m) ? 31 : 30;
    }

    /**
     * 一年的第几周
     * @returns {number}
     */
    function week_of_year() {
        if(month == 1 && week == 0) {
            return 1;
        }

        var
            daysCountInYear = days_in_year(year),
            firstWeek = (new Date(year + '-01-04')).getDay()
        ;

        firstWeek = firstWeek == 0 ? 7 : firstWeek;

        if(daysCountInYear > 4 - firstWeek) {
            // 属于今年的周, 计算当年第一周的范围
            if(daysCountInYear <= 4+(7-firstWeek) && targetDate.getDate() >= 4-(firstWeek-1) && targetDate.getDate() <= 4+(7-firstWeek)) {
                return 1;
            }

            // 12月份末尾需要判断是否是下一年的第一周
            if(month == 12) {
                //下一年的第一周的星期
                var nextWeekFirstWeek = (new Date((year+1) + '-01-04')).getDay();
                nextWeekFirstWeek = nextWeekFirstWeek == 0 ? 7 : nextWeekFirstWeek;

                // 计算当天日期是否处于下一年中的第一周范围内
                if( targetDate.getDate()-32 >= 4 - nextWeekFirstWeek) {
                    return 1;
                }
            }

            //当年当前日期的总天数
            return Math.ceil((daysCountInYear + (7 - week) - 3) / 7);
        } else {
            // 计算去年最后一周
            var lastWeek = (new Date((year-1) + '-12-31')).getDay();
            lastWeek = lastWeek == 0 ? 7 : lastWeek;
            var daysInLastYear = leep_year(year-1) ? 366 : 365;
            // (总天数 - 4号到当前日的天数 + 补足日期周数) / 7
            return Math.ceil((daysInLastYear - 3+ (7 - lastWeek)) / 7);
        }
    }

    function days_in_year(y)  {
        var daysCountInYear = 0;

        for(var i=0; i<targetDate.getMonth(); i++) {
            daysCountInYear += days_in_month(y, i+1);
        }

        daysCountInYear += day;
        return daysCountInYear;
    }

    var DAY_SUBFIX = {1:'st', 2:'nd', 3:'rd', 21:'st', 22:'nd', 23:'rd', 31:'st'};
    var MONTH_NAME = [null, 'January', 'February', 'March', 'April', 'May', "Jun", "July", "August", "September", "October", "November", "December"];
    var WEEK_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var keymap = {
        // 天, 01-31
        d: pad(day, 0, 2),

        // 天, 1-31
        j: String(day),

        // 周名(短)
        D: function() {
            return WEEK_NAME[week].substr(0, 3);
        },

        // 周名
        l: WEEK_NAME[week],
        N: week ? week : 7,

        // 月份后缀, 如th, rd
        S: DAY_SUBFIX[day]?DAY_SUBFIX[day]:'th',

        // 周0-6
        w: week,

        //年份中的第几天 0 - 361
        z: function() {
            return days_in_year(year) - 1;
        },

        //当年第几周
        W: function () {
            return pad(week_of_year(), 0, 2);
        },

        // 月份名称
        F: MONTH_NAME[month],

        // 月份短名称
        M: MONTH_NAME[month].substr(0,3),

        // 月份01-12
        m: pad(month, 0,2),

        //指定月份有多少天, 28-31
        n: targetDate.getMonth() + 1,
        t: function() {
            return days_in_month(year, month);
        },

        //是否为闰年
        L: function() {
            return Number(leep_year(year));
        },

        // 年份 如:2001
        Y: String(year),
        o: function() {
            var weekofyear = week_of_year();

            if(month == 1 && weekofyear > 8) {
                return String(year-1);
            }

            if(month == 12 && weekofyear < 8) {
                return String(year + 1);
            }

            return String(year);
        },

        // 年份 如 01
        y: function() {
            return String(year).substr(2)
        },

        // 上午下午
        a: ['am', 'pm'][Number(hour >= 12)].toLowerCase(),
        A: ['am', 'pm'][Number(hour >= 12)].toUpperCase(),

        // 小时, 24小时制, 如8, 16
        G: String(hour),
        // 小时, 12小时制, 如8, 4
        g: String(hour == 0 ? 12 : hour-12),

        // 小时, 24小时制, 如08, 16
        H: pad(hour, 0, 2),

        // 小时, 12小时制, 如08, 04
        h: pad(hour == 0 ? 12 : hour-12, 0, 2),

        // 分钟, 如09
        i: pad(min, 0, 2),

        // 秒钟
        s: pad(sec, 0, 2),

        // 微秒
        u: function() {
            return pad(String(targetDate.getMilliseconds()), 0, 6, true);
        },
        
        // 毫秒
        v: function() {
            return pad(String(targetDate.getMilliseconds()).substr(0, 3), 0, 3, true)
        },

        // 时间戳(秒)
        U: function() {
            return String(parseInt(targetDate.getTime()/1000));
        }
    };

    var newFormat = '';

    for(var i=0; i<format.length; i++) {
        if(typeof keymap[format[i]] == 'undefined') {
            newFormat += format[i];
        } else {
            var mapVal = keymap[format[i]];
            newFormat += type.isFunction(mapVal) ? mapVal() : mapVal;
        }
    }

    return newFormat;
}