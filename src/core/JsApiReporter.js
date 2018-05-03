getJasmineRequireObj().JsApiReporter = function() {
  const noopTimer = {
    start() {},
    elapsed() { return 0 }
  }

  function JsApiReporter(options) {
    const timer = options.timer || noopTimer
    let status = 'loaded'

    this.started = false
    this.finished = false
    timer.runDetails = {}
  }
}
