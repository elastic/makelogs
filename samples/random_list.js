/**
 * @class RandomList
 */

module.export = class RandomList {
  constructor(list) {
    this.get = () => (
      list[Math.round(Math.random() * list.length)]
    )
  }
}
