getJasmineRequireObj().MockDate = function() {
  function MockDate(global) {
    const self = this
    let currentTime = 0

    if (!global || !global.Date) {
      self.install = function() {}
      self.tick = function() {}
      self.uninstall = function() {}
      return self
    }

    const GlobalDate = global.Date

  }

  return MockDate
}
