'use strict';

module.exports = IpGenerator;

const random = (min, max) => (
  min + Math.floor(Math.random() * (max - min + 1))
)

function IpGenerator(maxCount, maxSessions) {
  this.maxSessions = maxSessions;
  this.maxCount = maxCount;

  this.sessions = [];
}

IpGenerator.prototype.get = function () {
  var session, index;
  if (this.sessions.length < this.maxSessions) {
    session = [this.makeRandom(), 0];
    index = this.sessions.length;
    this.sessions.push(session);
  } else {
    index = random(0, this.sessions.length - 1);
    session = this.sessions[index];
  }

  if (session[1] > this.maxCount) {
    this.sessions.splice(index, 1);
    return this.getIp();
  } else {
    return session[0];
  }
};

IpGenerator.prototype.makeRandom = function () {
  return random(0, 255) + '.' +
    random(0, 255) + '.' +
    random(0, 255) + '.' +
    random(0, 255);
};
