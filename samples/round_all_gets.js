module.exports = stoch => {
  const origGet = stoch.get
  stoch.get = () => Math.round(origGet.call(stoch))
  return stoch
}
