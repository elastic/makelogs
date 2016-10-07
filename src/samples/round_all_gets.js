module.exports = stoch =>
  (...args) =>
    Math.round(stoch.get(...args))
