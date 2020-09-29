/**
 * 格式化日期, 类似php的date函数，具体使用方式请参考文档
 * @see https://gitee.com/jinko/js-datef/blob/master/README.md
 * @see https://gitee.com/jinko/js-datef/blob/master/README.en.md
 *
 * @param {String} format 字符串格式
 * 指定生成时间格式的字符串，例如 Y-m-d H:i:s 会生成类似 2020-12-12 09:30:00 的时间格式
 * 详细格式说明请参考文档
 *
 * @param {String|Date|Number|null} time 日期
 * 指定的时间或日期, 可以是时间戳（秒）、Date对象、字符串时间格式（如2020-12-21）
 * 若为空（null、undefined、false、空字符串）则取当前时间
 *
 * @param {String|undefined} adjustments 调节器
 * 用于重新调整时间, 例如当前时间的周一、或者增加2周时间， 减少50分钟等。
 * 格式 [{weekname[:begin|end]}](+|-){number}[y|m|d|h|i|s|w] 不区分大小写
 * 示例:
 * 周一这个时间点再加2个小时 = Monday + 2h
 * 加三周少50分钟 = +3w-50i
 * 详细格式说明请参考文档
 *
 * @returns {String}
 */
function datef(format, time, adjustments) {
    var targetDate = null;
    var funcName;
    
    try {
        funcName = arguments.callee.name;
    } catch (e) {
        funcName = 'datef';
    }
    
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
        NUMBER: _typeof(1),

        isString: function (v) {
            return _typeof(v) === this.STRING;
        },

        isFunction: function (v) {
            return _typeof(v) === this.FUNCTION;
        },
        
        isUndefined: function (v) {
            return _typeof(v) === this.UNDEFINED;
        },
        
        isNumber: function (v) {
            return _typeof(v) === this.NUMBER;
        },
    };

    //检查format
    if(!type.isString(format)) {
        if(type.isFunction(format.toString)) {
            format = format.toString();
        } else {
            console.error("Invalid argument 1 \""+ format +"\" for "+funcName+"()\n");
            return '';
        }
    }
    
    // 检查时间戳
    if(!time && time !== 0) {
        targetDate = new Date();
    } else if(time instanceof Date) {
        targetDate = time;
    } else if(type.isNumber(time)) {
        targetDate = new Date(parseInt(time)*1000);
    } else {
        if(type.isString(time) && time.indexOf(':') == -1) {
            // 采用php的默认时间
            time += ' 00:00:00';
        }
        
        targetDate = new Date(time);

        if(isNaN(targetDate.getTime())) {
            console.error('Invalid argument 2 "'+ time +'" for '+funcName+'()');
            return '';
        }
    }
    
    //时间调整
    if(adjustments) {
        try {
            targetDate = adjust(targetDate, adjustments);
        } catch (e) {
            console.error(
                "Unrecognizable argument 3 \""+ adjustments +"\" for "+funcName+"()" +
                (e ? ("\n"+e) : '') +
                "\nsee https://gitee.com/jinko/js-datef/blob/master/README.md" +
                "\nhttps://gitee.com/jinko/js-datef/blob/master/README.en.md"
            );
            return '';
        }
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
    
    /**
     * 时间调整
     * @param date
     * @param adjustments
     * @returns {Date|*}
     */
    function adjust(date, adjustments) {
        if(!adjustments || !type.isString(adjustments)) {
            return date;
        }
        
        adjustments = adjustments.toLowerCase().replace(/^\s+|\s+$/, '');
        var adjustSec = 0;
        var matched = adjustments.match(/^((?:[a-z:]+))?\s*((?:[+\-]\s*(?:(?:[0-9]+[ymdhisw]?)+\s*))*)$/);
        var weekSec = 0;
        var weekIndex = {
            monday: 1, mon:1,
            tuesday: 2, tue:2,
            wednesday: 3, wed:3,
            thursday: 4, thu:4,
            friday: 5, fri:5,
            saturday: 6, sat:6,
            sunday: 7, sun:7
        };

        if(!matched) {
            throw "";
        }
        
        var weekAdjustment = matched[1];
        var detailAdjustment = matched[2];
        var beAdjustment = null;
        
        if(weekAdjustment) {
            weekAdjustment = weekAdjustment.split(':');
            beAdjustment = weekAdjustment[1];
            weekAdjustment = weekAdjustment[0];
        }
        
        if(weekAdjustment) {
            if(type.isUndefined(weekIndex[weekAdjustment])) {
                throw "Invalid '"+ weekAdjustment +"' for weekname";
            }

            var curday = date.getDay();
            curday = curday==0?7:curday;
            var weekDay = curday - weekIndex[weekAdjustment];
            date = new Date(date.getTime() + (weekDay * 24 * 3600 * -1 * 1000));
        }
    
        if(beAdjustment) {
            if(beAdjustment == 'begin') {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
            } else if(beAdjustment == 'end') {
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
            } else {
                throw "Invalid '"+ beAdjustment +"' for daytime";
            }
        }
        
        var keyValues = {d:24*3600, h:3600, i:60, s:1, w:7*24*3600};
        
        if(detailAdjustment) {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            
            detailAdjustment
                .match(/([+\-]\s*([0-9]+[ymdhisw]?)+\s*)/g)
                .forEach(function(adj) {
                    adj = adj.trim();
                    var op = adj.substr(0, 1);
                    op = op=='-'?-1:1;

                    adj.match(/([0-9]+[ymdhisw]?\s*)/g).forEach(function (value) {
                        if(/^[0-9]+$/.test(value)) {
                            adjustSec += parseInt(value)*op;
                            return;
                        }
                        
                        var key = value.substr(-1);
                        var val = value.substr(0);

                        val = parseInt(val.substr(0, val.length-1));

                        if(keyValues[key]) {
                            val = val * keyValues[key];
                        } else {
                            if(key == 'y') {
                                year += val*op;
                            } else if(key == 'm') {
                                year += parseInt(val/12) * op;
                                month += (val%12) * op;

                                if(op>0 && month>12) {
                                    month -= 12;
                                    year ++;
                                }

                                if(op<0 && month < 1) {
                                    month += 12;
                                    year --;
                                }
                            }
    
                            day = Math.min(days_in_month(year, month), day);
                            return;
                        }

                        adjustSec += val*op;
                    })
                })
            ;
    
            date.setDate(day);
            date.setFullYear(year);
            date.setMonth(month-1);
        }
        
        date = new Date(date.getTime() + (adjustSec+weekSec) * 1000);
        return date;
    }

    /**
     * 填充
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
     * @param y 年份, 例如2018
     * @param m 月份, 范围1-12
     * @returns {number}
     */
    function days_in_month(y, m)  {
        if(m == 2) {
            return leep_year(y) ? 29 : 28;
        }

        //是否小月
        return [4,6,9,11].indexOf(m)>=0 ? 30 : 31;
    }
    
    /**
     * 一年的第几周
     * @returns {number}
     */
    function week_of_year() {
        let daysOfYear = days_of_year();
        let firstWeek = new Date(year + '-01-01 00:00:00').getDay();
        let lastWeek = new Date(year + '-12-31  00:00:00').getDay();
        
        firstWeek = firstWeek == 0 ? 7 : firstWeek;
        lastWeek = lastWeek == 0 ? 7 : lastWeek;
        
        let beginDay=1, endDay=leep_year(year) ? 366 : 365;
        
        if(firstWeek > 4) {
            beginDay = 1 + 8-firstWeek;
        }
        
        if(lastWeek < 4) {
            endDay -= lastWeek;
        }
        
        if(daysOfYear < beginDay) {
            //上一年的最后一周
            let totalDaysLastYear = leep_year(year-1) ? 366 : 365;
            let lastYearFirstWeek = new Date((year-1) + '-01-01 00:00:00').getDay();
            lastYearFirstWeek = lastYearFirstWeek == 0 ? 7 : lastYearFirstWeek;
            
            if(lastYearFirstWeek > 4) {
                //1号是第一周
                return Math.ceil((totalDaysLastYear-10+lastYearFirstWeek) / 7);
            } else {
                //1号不是第一周
                return Math.ceil(Math.max(totalDaysLastYear - 8+lastYearFirstWeek, 0) / 7) + 1;
            }
        }
        
        if(daysOfYear > endDay) {
            //下一年的第一周
            return 1;
        }
        
        if(firstWeek <= 4) {
            //1号是第一周
            return Math.ceil(Math.max(daysOfYear - 8+firstWeek, 0) / 7) + 1;
        } else {
            //1号不是第一周
            return Math.ceil((daysOfYear - beginDay + 1)/7);
        }
    }
    
    /**
     * 一年的第几天
     * @returns {number}
     */
    function days_of_year()  {
        var daysCountInYear = 0;

        for(var i=0; i<month-1; i++) {
            daysCountInYear += days_in_month(year, i+1);
        }

        daysCountInYear += day;
        return daysCountInYear;
    }

    var DAY_SUBFIX = {1:'st', 2:'nd', 3:'rd', 21:'st', 22:'nd', 23:'rd', 31:'st'};
    var MONTH_NAME = [null, 'January', 'February', 'March', 'April', 'May', "June", "July", "August", "September", "October", "November", "December"];
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
            return days_of_year()-1;
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
        if(format[i] == '\\') {
            if(format[i+1] == '\\') {
                i++;
                newFormat += '\\';
            } else if(format[i+1] == '{') {
                i++;
                newFormat += '{';
            } else {
                newFormat += '\\';
            }
        } else if(format[i] == '{') {
            var pos = format.indexOf('}', i);
            
            if(pos == -1) {
                newFormat += '{';
            } else {
                newFormat += format.substr(i+1, pos-i-1);
                i = pos;
            }
        } else if(typeof keymap[format[i]] == 'undefined') {
            newFormat += format[i];
        } else {
            var mapVal = keymap[format[i]];
            newFormat += type.isFunction(mapVal) ? mapVal() : mapVal;
        }
    }

    return newFormat;
}
