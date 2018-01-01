/**
 * @class RandomList
 */

module.exports = RandomList;

function RandomList(list) {
  this.get = function () {
    return list[Math.floor(Math.random() * list.length)];
  };
}
