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
  }

  return Clock
}
