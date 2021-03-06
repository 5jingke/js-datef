# js-datef

## 介绍
JavaScript 日期时间格式化函数

## 安装或引入

```html
<script type="text/javascript" src="datef.js"></script>

或者

<script type="text/javascript" src="datef.min.js"></script>
```

## 定义

```javascript
/**
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
function datef(format, date, adjustments) {};
```

## 使用示例

```javascript

//返回当前时间类似"2020-09-30 12:30:11"的时间格式
datef('Y-m-d H:i:s');
datef();

//"200930"
datef('ymd');

//"Fri Sep 18 2020 14:59:36"
datef('D M d Y H:i:s');


//"2021-01-09 08:00:00"
datef('Y-m-d H:i:s', 1610150400);

//"2021-01-09 08:00:00"
datef('Y-m-d H:i:s', "1610150400");

//"2020-12-30 08:00:00"
datef('Y-m-d H:i:s', "2020-12-30");

//"Wed Dec 30 2020 10:33:12"
datef('D M d Y H:i:s', "2020-12-30 10:33:12");

//"2020-09-18"
var date = new Date();
datef('Y-m-d', date);


//当前周周一早上8点
datef('Y-m-d 08:00:00', null, "mon");
datef('Y-m-d H:i:s', null, "mon:begin +8h");
datef('Y-m-d H:i:s', datef('Y-m-d'), 'mon +8h');


//当前周一 至 周日 时间
//周一
datef('Y-m-d H:i:s', null, "mon:begin");
//周日
datef('Y-m-d H:i:s', null, "sun:end");


//当月月初至月底
//月初
datef('Y-m-01 H:i:s', null, ":begin");
//月底
datef('Y-m-t H:i:s', null, ":end");

//最近10天
var date=new Date();
//开始
datef('Y-m-d H:i:s', date, "-10d");
//结束
datef('Y-m-d H:i:s', date);

//2013-12-20 10:00:00 的最近七天(最近一周)
var date=new Date();
//开始
datef('Y-m-d H:i:s', '2013-12-20 10:00:00', "-1w");
//结束
"2013-12-20 10:00:00"


//下月底
datef('Y-m-t H:i:s', null, ":end +1m");

//上月底
datef('Y-m-t H:i:s', null, ":end -1m");

//年底
datef('Y-12-31 H:i:s', null, ":end");

//3小时前
//开始
datef(null, null, "-3h");
//结束
datef();

//三小时前的时间戳(秒)
datef('U', null, "-3h");
//当前时间戳
datef('U');

// 字符串原样显示 Tomorrow is 2020-09-29
datef('{Tomorrow is} Y-m-d', '2020-09-28', '+1d');

// '{}'符串原样显示 Tomorrow is {200929} 2020-09-29
datef('{Tomorrow is} \\{ymd} Y-m-d', '2020-09-28', '+1d');

// '\'符串原样显示 Tomorrow is \ ymd 2020-09-29
datef('{Tomorrow is} \\\\ {ymd} Y-m-d', '2020-09-28', '+1d');


```


## 说明

#### 格式化参数(format): 

> _使用大括号 '{}' 中的文本将原样显示, 例如 {test} 中的test不会被解析_


| format字符 | 说明| 返回值 |
| --- | --- | --- |
|d|一个月中的第几天，有前导 0 的 2 位数字|从 01 到 31|
|D|3 个字符表示的星期几|从 Mon 到 Sun|
|j|一个月中的第几天，无前导 0|从 1 到 31|
|l (小写 'L')|星期几，英文全称|从 Sunday 到 Saturday|
|N|ISO-8601 规定的数字表示的星期几|从 1 （表示星期一）到 7 （表示星期日）|
|S|一个月中的第几天，带有 2 个字符表示的英语序数词。|st， nd， rd 或者 th。 可以和 j 联合使用。|
|w|数字表示的星期几|从 0 （星期日） 到 6 （星期六）|
|z|一年中的第几天，从 0 开始计数|从 0 到 365|
|周|---|---|
|W|ISO-8601 规范的一年中的第几周，周一视为一周开始。|示例： 42 （本年第42周）|
|月|---|---|
|F|月份英文全拼，例如：January 或 March|从 January 到 December|
|m|带有 0 前导的数字表示的月份|从 01 到 12|
|M|3 个字符表示的月份的英文简拼|从 Jan 到 Dec|
|n|月份的数字表示，无前导 0|1 through 12|
|t|给定月份中包含多少天|从 28 到 31|
|年|---|---|
|L|是否为闰年|如果是闰年，则返回 1，反之返回 0。|
|o|ISO-8601 规范的年份，同 Y 格式。<br>有一种情况除外：当 ISO 的周数（W）属于前一年或者后一年时，会返回前一年或者后一年的年份数字表达。<br> 属于前一年或者后一年时，会返回前一年或者后一年的年份数字表达。 |示例：1999 或 2003|
|Y|4 位数字的年份|示例：1999 或 2003|
|y|2 位数字的年份|示例： 99 或 03|
|时间|---|---|
|a|上午还是下午，2 位小写字符|am 或 pm|
|A|上午还是下午，2 位大写字符|AM 或 PM|
|g|小时，12时制，无前导 0|从 1 到 12|
|G|小时，24时制，无前导 0|从 0 到 23|
|h|小时，12时制，有前导 0 的 2 位数字|从 01 到 12|
|H|小时，24时制，有前导 0 的 2 位数字|00 through 23|
|i|分钟，有前导 0 的 2 位数字|从 00 到 59|
|s|秒，有前导 0 的 2 位数字|从 00 到 59|
|u|微秒 |示例： 654321|
|v|毫秒 |示例： 654|
|U|自 1970 年 1 月 1 日 0 时 0 分 0 秒（GMT 时间）以来的时间，以秒为单位|


#### 时间调整格式(adjustments):

> _不区分大小写_

- 周调整

格式: `周名:时间起点`

例如: `Monday:begin`

周名:

| key | 说明 |
| --- | --- |
| Mon | 周一 |
| Monday | 周一 |
| Tue | 周二 |
| Tuesday | 周二 |
| Wed | 周三 |
| Wednesday | 周三 |
| Thu | 周四 |
| Thursday | 周四 |
| Fri | 周五 |
| Friday | 周五 |
| Sat | 周六 |
| Saturday | 周六 |
| Sun | 周日 |
| Sunday | 周日 |

时间起点:

| key | 说明 |
| --- | --- |
| begin | 将时间调整到 00:00:00 |
| end | 将时间调整到  23:59:59 |


- 时间调整字符

格式 `[+|-]{number}{时间调整字符}...`

例如 `+1y5d4h-10i-2s` 加1年5天4小时少10分钟2秒

相同写法:
 `+1y5d4h-10i2s`

 `+1y5d4h -10i2s`

 `+1y +5d +4h -10i -2s`



| key | 说明 |
| --- | --- |
| y | 年份 |
| m | 月份 |
| d | 日期 |
| h | 小时 |
| i | 分钟 |
| s | 秒钟 |
| w | 周 |
