getJasmineRequireObj().Clock = function() {
  /* global process */
  const NODE_JS = typeof process !== 'undefined' && process.versions && typeof process.versions.node === 'string'

  /**
   * _Note:_ Do not construct this directly, Jasmine will make one during booting. You can get the current clock with {@link jasmine.clock}.
   * @class Clock
   * @classdesc Jasmine's mock clock is used when testing time dependent code.
   */
  function Clock(global, delayedFunctionSchedulerFactory, mockDate) {
    const self = this
    const realTimingFunctions = {
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      setInterval: global.setInterval,
      clearInterval: global.clearInterval
    }
    const fakeTimingFunctions = {
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval
    }

    let installed = false
    let delayedFunctionScheduler
    let timer

    self.FakeTimeout = FakeTimeout

    self.install = function() {
      if (!originalTimingFunctionsIntact()) {
        throw new Error('Jasmine Clock was unable to install over custom global timer functions. Is the clock already installed?')
      }

      replace(global, fakeTimingFunctions)
      timer = fakeTimingFunctions
      delayedFunctionScheduler = delayedFunctionSchedulerFactory()
      installed = true

      return self
    }

    /**
     * Uninstall the mock clock, returning the built-in methods to their places.
     * @name Clock#uninstall
     * @function
     */
    self.uninstall = function() {
      delayedFunctionScheduler = null
      mockDate.uninstall()
      replace(global, realTimingFunctions)

      timer = realTimingFunctions
      installed = false
    }

    /**
     * Execute a function with a mocked Clock
     *
     * The clock with be {@link Clock#install|install)ed before the function is called and {@link Clock#uninstall|unintall}ed in a `finally` after the function completes.
     * @name Clock#WithMock
     * @function
     * @param {Function} closure The function to be called.
     */
    self.withMock = function(closure) {
      this.install()
      try {
        closure()
      } finally {
        this.uninstall()
      }
    }

    /**
     * Instruct the installed Clock to also mock the date returned by `new Date()`
     * @name Clock#mockDate
     * @function
     * @param {Date} [initialDate=now] The `Date` to provide.
     */
    self.mockDate = function(initialDate) {
      mockDate.install(initialDate)
    }

    self.setTimeout = function(fn, delay, params) {
      return Function.prototype.apply.apply(timer.setTimeout, [global, arguments])
    }

    self.setInterval = function(fn, delay, params) {
      return Function.prototype.apply.apply(timer.setInterval, [global, arguments])
    }

    self.clearTimeout = function(id) {
      return Function.prototype.call.apply(timer.clearTimeout, [global, id])
    }

    self.clearInterval = function(id) {
      return Function.prototype.call.apply(timer.clearInterval, [global, id])
    }

    self.tick = function(millis) {
      if (installed) {
        delayedFunctionScheduler.tick(millis, (millis) => mockDate.tick(millis))
      } else {
        throw new Error('Mock clock is not installed, use jasmine.clock().install()')
      }
    }

    return self

  }

  return Clock
}
