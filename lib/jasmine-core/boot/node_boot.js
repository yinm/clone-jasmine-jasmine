module.exports = (jasmineRequire) => {
  const jasmine = jasmineRequire.core(jasmineRequire)
  const env = jasmine.getenv({suppressLoadErrors: true})
  const jasmineInterface = jasmineRequire.interface(jasmine, env)

  extend(global, jasmineInterface)

  function extend(destination, source) {
    for (let property in source) destination[property] = source[property]
    return destination
  }

  return jasmine
}
