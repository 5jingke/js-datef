const testCases = [];

function add_unit_test(format, adjustments, date, expection) {
    testCases.push({
        format, adjustments, date, expection
    });
}

function test() {
    let testResults = {
        total: 0,
        success: 0,
        fail: 0,
        logs: []
    };
    
    let colors = {
        def: 'color:black;font-weight:normal;',
        num: 'color:blue;',
        succ: 'color:green;',
        err: 'color:red',
        errb: 'color:red;font-weight:bold',
        ret: 'color:#9247ab;',
        exp: 'color:#1e808a;',
        js: 'color:#b1360f;'
    };
    
    var logerr = console.error, error=null;
    console.error = function (e) {
        error = e;
    };
    
    for (let i=0; i<testCases.length; i++) {
        testResults.total ++;
        let testCase = testCases[i];
        let testJs = `datef('${testCase.format}', '${testCase.date}', '${testCase.adjustments}')`;
        let evalResult=eval(testJs), evalerr='';
        
        if(error) {
            evalerr = error
            error = null;
        }
        
        let testResult = {
            js: testJs,
            success: testCase.expection === evalResult,
            evalResult: evalResult,
            expection: testCase.expection,
            err:evalerr
        };
        
        if(testResult.success) {
            testResults.success ++;
        } else {
            testResults.fail ++;
        }
        
        testResults.logs.push(testResult);
    }
    
    console.error = logerr;
    let succPercent = ((testResults.success / testResults.total)*100).toFixed(1) + '%';
    
    console.log(
        `总共测试 %c${testResults.total}%c 例，成功 %c${testResults.success}%c 例，失败 %c${testResults.fail}%c 例，成功率 %c${succPercent}`,
        colors.num, colors.def,
        colors.succ, colors.def,
        colors.errb, colors.def,
        colors.num
    );
    
    for (let i=0; i<testResults.logs.length; i++) {
        let log = testResults.logs[i];
        
        if(log.success) {
            console.groupCollapsed(`%c成功%c ${log.js}`, colors.succ, colors.def);
            console.log(
                `       js=%c${log.js}%c\n   result=%c${log.evalResult}%c\nexpection=%c${log.expection}`,
                colors.js, colors.def,
                colors.ret, colors.def,
                colors.exp
            );
            console.groupEnd();
        } else {
            console.log(
                `%c失败%c   js=%c${log.js}%c\n   result=%c${log.evalResult}%c\nexpection=%c${log.expection}%c\n    error=%c${log.err}`,
                colors.errb, colors.def,
                colors.js, colors.def,
                colors.ret, colors.def,
                colors.exp, colors.def,
                colors.err
            );
        }
    }
    
    console.log(
        `总共测试 %c${testResults.total}%c 例，成功 %c${testResults.success}%c 例，失败 %c${testResults.fail}%c 例，成功率 %c${succPercent}`,
        colors.num, colors.def,
        colors.succ, colors.def,
        colors.errb, colors.def,
        colors.num
    );
}


// 基础测试
add_unit_test('Y-m-d H:i:s', '', '2020-10-02 10:20:00', '2020-10-02 10:20:00');
add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2020-09-28 16:30:49',
    '28 Mon 28 Monday 1 th 1 271 40 September 09 Sep 9 30 1 2020 2020 20 pm PM 4 16 16 30 49 ' + (new Date('2020-09-28 16:30:49').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2000-02-27 16:30:49',
    '27 Sun 27 Sunday 7 th 0 57 08 February 02 Feb 2 29 1 2000 2000 00 pm PM 4 16 16 30 49 ' + (new Date('2000-02-27 16:30:49').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2000-12-30 16:30:49',
    '30 Sat 30 Saturday 6 th 6 364 52 December 12 Dec 12 31 1 2000 2000 00 pm PM 4 16 16 30 49 ' + (new Date('2000-12-30 16:30:49').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2000-01-01 16:30:49',
    '01 Sat 1 Saturday 6 st 6 0 52 January 01 Jan 1 31 1 1999 2000 00 pm PM 4 16 16 30 49 ' + (new Date('2000-01-01 16:30:49').getTime()/1000)
);


add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '1993-01-01 16:30:49',
    '01 Fri 1 Friday 5 st 5 0 53 January 01 Jan 1 31 0 1992 1993 93 pm PM 4 16 16 30 49 ' + (new Date('1993-01-01 16:30:49').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '1993-12-30 16:30:49',
    '30 Thu 30 Thursday 4 th 4 363 52 December 12 Dec 12 31 0 1993 1993 93 pm PM 4 16 16 30 49 ' + (new Date('1993-12-30 16:30:49').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '1993-06-10 16:30:49',
    '10 Thu 10 Thursday 4 th 4 160 23 June 06 Jun 6 30 0 1993 1993 93 pm PM 4 16 16 30 49 ' + (new Date('1993-06-10 16:30:49').getTime()/1000)
);
//
add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2021-08-08 23:59:59',
    '08 Sun 8 Sunday 7 th 0 219 31 August 08 Aug 8 31 0 2021 2021 21 pm PM 11 23 23 59 59 ' + (new Date('2021-08-08 23:59:59').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2004-02-29 00:00:00',
    '29 Sun 29 Sunday 7 th 0 59 09 February 02 Feb 2 29 1 2004 2004 04 am AM 12 0 00 00 00 ' + (new Date('2004-02-29 00:00:00').getTime()/1000)
);

add_unit_test('d D j l N S w z W F m M n t L o Y y a A g G H i s U', '',
    '2007-02-28 00:00:00',
    '28 Wed 28 Wednesday 3 th 3 58 09 February 02 Feb 2 28 0 2007 2007 07 am AM 12 0 00 00 00 ' + (new Date('2007-02-28 00:00:00').getTime()/1000)
);

//失败例子
add_unit_test('Y-m-d H:i:s', 'Frid +1w',       '2020-09-10 00:00:00', '2020-09-18 00:00:00');
//失败例子
add_unit_test('Y-m-d H:i:s', 'Fri +1ww',       '2020-09-10 00:00:00', '2020-09-18 00:00:00');

// adjustments 测试
add_unit_test('Y-m-d H:i:s', '+1y',            '2020-10-02 10:20:00', '2021-10-02 10:20:00');
add_unit_test('Y-m-d H:i:s', '+4m',            '2020-10-02 10:20:00', '2021-02-02 10:20:00');
add_unit_test('Y-m-d H:i:s', '+16m',           '2020-10-02 10:20:00', '2022-02-02 10:20:00');
add_unit_test('Y-m-d H:i:s', '+1y3m',          '2020-10-02 10:20:00', '2022-01-02 10:20:00');
add_unit_test('Y-m-d H:i:s', '+3d',            '2020-10-02 10:20:00', '2020-10-05 10:20:00');
add_unit_test('Y-m-d H:i:s', '+1w',            '2020-10-02 10:20:00', '2020-10-09 10:20:00');
add_unit_test('Y-m-d H:i:s', '+1y3m-10i',      '2020-10-02 10:20:00', '2022-01-02 10:10:00');
add_unit_test('Y-m-d H:i:s', '+1y3m-10i5',     '2020-10-02 10:20:00', '2022-01-02 10:09:55');
add_unit_test('Y-m-d H:i:s', '-5',             '2020-10-02 10:20:00', '2020-10-02 10:19:55');
add_unit_test('Y-m-d H:i:s', '+600',           '2020-10-02 10:20:00', '2020-10-02 10:30:00');
add_unit_test('Y-m-d H:i:s', '+3600',          '2020-10-02 10:20:00', '2020-10-02 11:20:00');
add_unit_test('Y-m-d H:i:s', '+3600s',         '2020-10-02 10:20:00', '2020-10-02 11:20:00');
add_unit_test('Y-m-d H:i:s', '+1y1m1d1h1i1s',  '2000-01-01 00:00:00', '2001-02-02 01:01:01');
add_unit_test('Y-m-d H:i:s', '+86400',         '2000-01-01 00:00:00', '2000-01-02 00:00:00');
add_unit_test('Y-m-d H:i:s', '+24h',           '2000-01-01 00:00:00', '2000-01-02 00:00:00');
add_unit_test('Y-m-d H:i:s', '+28d',           '2000-02-01 00:00:00', '2000-02-29 00:00:00');
add_unit_test('Y-m-d H:i:s', '+29d',           '2000-02-01 00:00:00', '2000-03-01 00:00:00');
add_unit_test('Y-m-d H:i:s', '+14d',           '2000-02-01 00:00:00', '2000-02-15 00:00:00');
add_unit_test('Y-m-d H:i:s', '+2w',           '2000-02-01 00:00:00', '2000-02-15 00:00:00');
add_unit_test('Y-m-d H:i:s', '+1d -12h +5i + 15s -1y',  '2000-02-01 00:00:00', '1999-02-01 12:05:15');

add_unit_test('Y-m-d H:i:s', 'Mon',           '2020-09-28 00:00:00', '2020-09-28 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Monday',        '2020-09-28 00:00:00', '2020-09-28 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Tue',           '2020-09-28 00:00:00', '2020-09-29 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Tuesday',       '2020-09-28 00:00:00', '2020-09-29 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Wed',           '2020-09-28 00:00:00', '2020-09-30 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Wednesday',     '2020-09-28 00:00:00', '2020-09-30 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Thu',           '2020-09-28 00:00:00', '2020-10-01 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Thursday',      '2020-09-28 00:00:00', '2020-10-01 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Fri',           '2020-09-28 00:00:00', '2020-10-02 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Friday',        '2020-09-28 00:00:00', '2020-10-02 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sat',           '2020-09-28 00:00:00', '2020-10-03 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Saturday',      '2020-09-28 00:00:00', '2020-10-03 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sun',           '2020-09-28 00:00:00', '2020-10-04 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sunday',        '2020-09-28 00:00:00', '2020-10-04 00:00:00');


add_unit_test('Y-m-d H:i:s', 'Mon',           '2020-09-10 00:00:00', '2020-09-07 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Monday',        '2020-09-10 00:00:00', '2020-09-07 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Tue',           '2020-09-10 00:00:00', '2020-09-08 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Tuesday',       '2020-09-10 00:00:00', '2020-09-08 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Wed',           '2020-09-10 00:00:00', '2020-09-09 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Wednesday',     '2020-09-10 00:00:00', '2020-09-09 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Thu',           '2020-09-10 00:00:00', '2020-09-10 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Thursday',      '2020-09-10 00:00:00', '2020-09-10 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Fri',           '2020-09-10 00:00:00', '2020-09-11 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Friday',        '2020-09-10 00:00:00', '2020-09-11 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sat',           '2020-09-10 00:00:00', '2020-09-12 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Saturday',      '2020-09-10 00:00:00', '2020-09-12 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sun',           '2020-09-10 00:00:00', '2020-09-13 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Sunday',        '2020-09-10 00:00:00', '2020-09-13 00:00:00');

add_unit_test('Y-m-d H:i:s', 'Fri +1w',       '2020-09-10 00:00:00', '2020-09-18 00:00:00');

add_unit_test('Y-m-d H:i:s', ':begin',       '2020-09-10 12:55:44', '2020-09-10 00:00:00');
add_unit_test('Y-m-d H:i:s', ':end',         '2020-09-10 12:55:44', '2020-09-10 23:59:59');
add_unit_test('Y-m-d H:i:s', 'Mon:begin',    '2020-09-10 02:55:44', '2020-09-07 00:00:00');
add_unit_test('Y-m-d H:i:s', 'Mon:end',      '2020-09-10 02:55:44', '2020-09-07 23:59:59');
add_unit_test('Y-m-d H:i:s', 'tue:end+3d1h', '2020-09-10 02:55:44', '2020-09-12 00:59:59');

add_unit_test('Y-m-d H:i:s', '+1m', '2020-01-31', '2020-02-29 00:00:00');
add_unit_test('Y-m-d H:i:s', '+1y', '2020-02-29', '2021-02-28 00:00:00');

add_unit_test('{明年的今天是} Y-m-d', '+1y', '2020-09-28', '明年的今天是 2021-09-28');
add_unit_test('{Tomorrow is} Y-m-d', '+1d', '2020-09-28', 'Tomorrow is 2020-09-29');
add_unit_test('{Tomorrow is} \\{ymd} Y-m-d', '+1d', '2020-09-28', 'Tomorrow is {200929} 2020-09-29');
add_unit_test('{Tomorrow is} \\\\{ymd} Y-m-d', '+1d', '2020-09-28', 'Tomorrow is \\{200929} 2020-09-29');
