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

    this.jasmineStarted = function() {
      this.started = true
      status = 'started'
      timer.start()
    }

    let executionTime

    this.jasmineDone = function(runDetails) {
      this.finished = true
      this.runDetails = runDetails
      executionTime = timer.elapsed()
      status = 'done'
    }

    /**
     * Get the current status for the Jasmine environment.
     * @name JsApiReporter#status
     * @function
     * @returns {string} - One of `loaded`, `started` or `done`
     */
    this.status = function() {
      return status
    }

  }
}
