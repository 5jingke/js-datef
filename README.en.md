# js-datef

## Description
Format a local time/date

## Install

```html
<script type="text/javascript" src="datef.js"></script>

或者

<script type="text/javascript" src="datef.min.js"></script>
```

## Comment

```javascript
/**
 * @param {String} format Format in string
 * Specify a string of time format, for example Y-m-d H:i:s will generate a time format similar to 2020-12-12 09:30:00
 *
 * @param {String|Date|Number|null} time Date
 * The specified time or date, which can be a timestamp (seconds), Date object, string time format (such as 2020-12-21)
 * If it is empty (null, undefined, false, empty string), take the current time
 *
 * @param {String|undefined} adjustments Adjustment string
 * Used to re-adjust the time, such as the current time on Monday, or increase the time by 2 weeks, decrease by 50 minutes, etc.。
 * Format: [{weekname[:begin|end]}](+|-){number}[y|m|d|h|i|s|w] not case sensitive
 * Example:
 * Add 2 hours at this time on Monday = Monday + 2h
 * 50 minutes less for three weeks = +3w-50i
 *
 * @returns {String}
 */
function datef(format, date, adjustments) {};
```

## Usage example

```javascript

//Return the current time in a time format similar to "2020-09-30 12:30:11"
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


//8 AM on Monday of the current week
datef('Y-m-d 08:00:00', null, "mon");
datef('Y-m-d H:i:s', null, "mon:begin +8h");
datef('Y-m-d H:i:s', datef('Y-m-d'), 'mon +8h');


//Current Monday to Sunday time
//Monday
datef('Y-m-d H:i:s', null, "mon:begin");
//Sunday
datef('Y-m-d H:i:s', null, "sun:end");


//The beginning of the month to the end of the month
//beginning of the month
datef('Y-m-01 H:i:s', null, ":begin");
//end of the month
datef('Y-m-t H:i:s', null, ":end");

//Last 10 days
var date=new Date();
//begin
datef('Y-m-d H:i:s', date, "-10d");
//end
datef('Y-m-d H:i:s', date);

//2013-12-20 10:00:00 Last seven days (last week)
var date=new Date();
//begin
datef('Y-m-d H:i:s', '2013-12-20 10:00:00', "-1w");
//end
"2013-12-20 10:00:00"


//End of next month
datef('Y-m-t H:i:s', null, ":end +1m");

//End of prev month
datef('Y-m-t H:i:s', null, ":end -1m");

//End of the year
datef('Y-12-31 H:i:s', null, ":end");

//3 hours ago
//begin
datef(null, null, "-3h");
//end
datef();

//Timestamp three hours ago (seconds)
datef('U', null, "-3h");
//Current timestamp
datef('U');

// The string is displayed as it is Tomorrow is 2020-09-29
datef('{Tomorrow is} Y-m-d', '2020-09-28', '+1d');

// Tomorrow is {200929} 2020-09-29
datef('{Tomorrow is} \\{ymd} Y-m-d', '2020-09-28', '+1d');

// Tomorrow is \ ymd 2020-09-29
datef('{Tomorrow is} \\\\ {ymd} Y-m-d', '2020-09-28', '+1d');


```


## Instructions

#### Formatting parameters

> _The text in braces'{}' will be displayed as it is, for example, the test in {test} will not be parsed_

|format character|Description|Example returned values|
| --- | --- | --- |
|Day|---|---|
|d|Day of the month, 2 digits with leading zeros|01 to 31|
|D|A textual representation of a day, three letters|Mon through Sun|
|j|Day of the month without leading zeros|1 to 31|
|l (lowercase 'L')|A full textual representation of the day of the week|Sunday through Saturday|
|N|ISO-8601 numeric representation of the day of the week |1 (for Monday) through 7 (for Sunday)|
|S|English ordinal suffix for the day of the month, 2 characters|st, nd, rd or th. Works well with j|
|w|Numeric representation of the day of the week|0 (for Sunday) through 6 (for Saturday)|
|z|The day of the year (starting from 0)|0 through 365|
|Week|---|---|
|W|ISO-8601 week number of year, weeks starting on Monday|Example: 42 (the 42nd week in the year)|
|Month|---|---|
|F|A full textual representation of a month, such as January or March|January through December|
|m|Numeric representation of a month, with leading zeros|01 through 12|
|M|A short textual representation of a month, three letters|Jan through Dec|
|n|Numeric representation of a month, without leading zeros|1 through 12|
|t|Number of days in the given month|28 through 31|
|Year|---|---|
|L|Whether it's a leap year|1 if it is a leap year, 0 otherwise.|
|o|ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.|Examples: 1999 or 2003|
|Y|A full numeric representation of a year, 4 digits|Examples: 1999 or 2003|
|y|A two digit representation of a year|Examples: 99 or 03|
|Time|---|---|
|a|Lowercase Ante meridiem and Post meridiem|am or pm|
|A|Uppercase Ante meridiem and Post meridiem|AM or PM|
|B|Swatch Internet time|000 through 999|
|g|12-hour format of an hour without leading zeros|1 through 12|
|G|24-hour format of an hour without leading zeros|0 through 23|
|h|12-hour format of an hour with leading zeros|01 through 12|
|H|24-hour format of an hour with leading zeros|00 through 23|
|i|Minutes with leading zeros|00 to 59|
|s|Seconds with leading zeros|00 through 59|
|u|Microseconds |Example: 654321|
|v|Milliseconds |Example: 654|
|Full Date/Time|---|---|
|U|Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)|See also time()|

#### adjustments:

> _not case sensitive_

- Adjust week

Format: `weekname:timepoint`

eg: `Monday:begin`

weekname:

| key | description |
| --- | --- |
| Mon | Monday |
| Monday | Monday |
| Tue | Tuesday |
| Tuesday | Tuesday |
| Wed | Wednesday |
| Wednesday | Wednesday |
| Thu | Thursday |
| Thursday | Thursday |
| Fri | Friday |
| Friday | Friday |
| Sat | Saturday |
| Saturday | Saturday |
| Sun | Sunday |
| Sunday | Sunday |

timepoint:

| key | description |
| --- | --- |
| begin | Adjust the time to 00:00:00 |
| end | Adjust the time to 23:59:59 |


- Time adjustment character

Format `[+|-]{number}{character}...`

eg: `+1y5d4h-10i-2s` Add 1 year, 5 days, 4 hours, 10 minutes and 2 seconds less

Same wording:
 `+1y5d4h-10i2s`

 `+1y5d4h -10i2s`

 `+1y +5d +4h -10i -2s`


| key | description |
| --- | --- |
| y | Year |
| m | Month |
| d | Day |
| h | Hour |
| i | Minute |
| s | Second |
| w | Week |
