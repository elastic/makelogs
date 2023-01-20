'use strict';

var samples = require('./samples');
var argv = require('./argv');
var stringGenerator = require('./samples/string_generator');

var eventCounter = -1;
var count = argv.total;
var moment = require('moment');

var countOfDays = (function () {
  var cursor = argv.start.clone();
  var count = 0;
  var end = argv.end.valueOf();

  if (cursor.valueOf() <= end) {
    do {
<<<<<<< HEAD
      cursor.add(1, argv.timeWindowType);
=======
      cursor.add(1, argv.timeType.valueOf());
>>>>>>> v1.1
      count += 1;
    } while (cursor.valueOf() <= end);
  }

  return count;
}());

var countPerDay = Math.ceil(count / countOfDays);
<<<<<<< HEAD
// console.log('Count', count, 'countOfDays', countOfDays, 'countPerDay', countPerDay);
=======
>>>>>>> v1.1
var indexInterval = argv.indexInterval;
var dayMoment = argv.start.clone();
var day;

module.exports = function RandomEvent(indexPrefix) {
  var event = {};

  var i = ++eventCounter;
  var iInDay = i % countPerDay;
  var ms = samples.lessRandomMsInDay();

  if (day && iInDay === 0) {
<<<<<<< HEAD
    dayMoment.add(1, argv.timeWindowType);
    day = null;
  }

  if (argv.timeWindowType === "day") {
=======
    dayMoment.add(1, argv.timeType.valueOf());
    day = null;
  }

  if (argv.timeType.valueOf() === "day") {
>>>>>>> v1.1
    if (day == null) {
      day = {
        year: dayMoment.year(),
        month: dayMoment.month(),
        date: dayMoment.date(),
      };
    }
    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;
    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;

    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;
    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, hours, minutes, seconds, ms);
<<<<<<< HEAD
  }
  else if (argv.timeWindowType === "hour") {
    if (day == null) {
      day = {
        year: dayMoment.year(),
        month: dayMoment.month(),
        date: dayMoment.date(),
        hour: dayMoment.hour(),
      };
    }
    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;
    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;
    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;
    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, day.hour, minutes, seconds, ms);
  }
  else {
    if (day == null) {
      day = {
        year: dayMoment.year(),
        month: dayMoment.month(),
        date: dayMoment.date(),
        hour: dayMoment.hour(),
        minute: dayMoment.minute(),
      };
    }
    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;
    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;
    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;
    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, day.hour, day.minute, seconds, ms);   
  }

  // console.log('i', i, 'iInDay', iInDay, 'day', day, 'date', date);
=======
  }
  else if (argv.timeType.valueOf() === "hour") {
    if (day == null) {
      day = {
        year: dayMoment.year(),
        month: dayMoment.month(),
        date: dayMoment.date(),
        hour: dayMoment.hour(),
      };
    }
    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;
    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;
    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;
    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, day.hour, minutes, seconds, ms);
  }
  else {
    if (day == null) {
      day = {
        year: dayMoment.year(),
        month: dayMoment.month(),
        date: dayMoment.date(),
        hour: dayMoment.hour(),
        minute: dayMoment.minute(),
      };
    }
    // extract number of hours from the milliseconds
    var hours = Math.floor(ms / 3600000);
    ms = ms - hours * 3600000;
    // extract number of minutes from the milliseconds
    var minutes = Math.floor(ms / 60000);
    ms = ms - minutes * 60000;
    // extract number of seconds from the milliseconds
    var seconds = Math.floor(ms / 1000);
    ms = ms - seconds * 1000;
    // apply the values found to the date
    var date = new Date(day.year, day.month, day.date, day.hour, day.minute, seconds, ms);   
  }
>>>>>>> v1.1
 
  var dateAsIso = date.toISOString();
  // console.log('dateAsIso', dateAsIso, 'date', date);
  switch (indexInterval) {
    case 'yearly':
      event.index = indexPrefix + dateAsIso.substr(0, 4);
      break;

    case 'monthly':
      event.index = indexPrefix + dateAsIso.substr(0, 4) + '.' + dateAsIso.substr(5, 2);
      break;
    case 'daily':
      event.index = indexPrefix + dateAsIso.substr(0, 4) + '.' + dateAsIso.substr(5, 2) + '.' + dateAsIso.substr(8, 2);
      break;

    default:
      event.index = indexPrefix + Math.floor(i / indexInterval);
      break;
  }
  event['@timestamp'] = dateAsIso;
  event.ip = samples.ips();
  event.extension = samples.extensions();
  event.response = samples.responseCodes();

  event.geo = {
    coordinates: samples.airports(),
    src: samples.countries(),
    dest: samples.countries()
  };
  event.geo.srcdest = event.geo.src + ':' + event.geo.dest;

  event['@tags'] = [
    samples.tags(),
    samples.tags2()
  ];
  event.utc_time = dateAsIso;
  event.referer = 'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts();
  event.agent = samples.userAgents();
  event.clientip = event.ip;
  event.bytes = event.response < 500 ? samples.lessRandomRespSize(event.extension) : 0;

  switch (event.extension) {
  case 'php':
    event.host = 'theacademyofperformingartsandscience.org';
    event.request = '/people/type:astronauts/name:' + samples.astronauts() + '/profile';
    event.phpmemory = event.memory = event.bytes * 40;
    break;
  case 'gif':
    event.host = 'motion-media.theacademyofperformingartsandscience.org';
    event.request = '/canhaz/' + samples.astronauts() + '.' + event.extension;
    break;
  case 'css':
    event.host = 'cdn.theacademyofperformingartsandscience.org';
    event.request = '/styles/' + samples.stylesheets();
    break;
  default:
    event.host = 'media-for-the-masses.theacademyofperformingartsandscience.org';
    event.request = '/uploads/' + samples.astronauts() + '.' + event.extension;
    break;
  }

  event.url = 'https://' + event.host + event.request;

  event['@message'] = event.ip + ' - - [' + dateAsIso + '] "GET ' + event.request + ' HTTP/1.1" ' +
      event.response + ' ' + event.bytes + ' "-" "' + event.agent + '"';
  event.spaces = 'this   is   a   thing    with lots of     spaces       wwwwoooooo';
  event.xss = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==" onload="alert(\'XSS found via img-onload!\')"><script>alert("XSS found via script-tag!")</script>';
  event.headings = [
    '<h3>' + samples.astronauts() + '</h5>',
    'http://' + samples.referrers() + '/' + samples.tags() + '/' + samples.astronauts()
  ];
  event.links = [
    samples.astronauts() + '@' + samples.referrers(),
    'http://' + samples.referrers() + '/' + samples.tags2() + '/' + samples.astronauts(),
    'www.' + samples.referrers()
  ];

  event.relatedContent = samples.relatedContent();

  event.machine = {
    os: samples.randomOs(),
    ram: samples.randomRam()
  };

  event.longValues = stringGenerator(Math.floor(Math.random() * 200 + 100));
  event.longValuesWithSpaces = stringGenerator(Math.floor(Math.random() * 200 + 100), true);

  var longFieldName = 'thisisaverylongfieldnamethatevendoesnotcontainanyspaces'
    + 'whyitcouldpotentiallybreakouruiinseveralplaces';
  event[longFieldName] = stringGenerator(Math.floor(Math.random() * 200 + 50));

  return event;
};
