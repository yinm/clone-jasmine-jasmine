getJasmineRequireObj().JsApiReporter = function() {
  const noopTimer = {
    start() {},
    elapsed() { return 0 }
  }

  /**
   * @name JsApiReporter
   * @classdesc {@link Reporter} added by default in `boot.js` to record results for retrieval in javascript code. An instance is made available as `JsApiReporter` on the global object.
   * @class
   * @hideconstructor
   */
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

    let suites = []
    let suites_hash = {}

    this.suiteStarted = function(result) {
      suites_hash[result.id] = result
    }

    this.suiteDone = function(result) {
      storeSuite(result)
    }

    /**
     * Get the results for a set of suites.
     *
     * Retrievable in slices for easier serialization.
     * @name JsApiReporter#suiteResults
     * @function
     * @param {Number} index - The position in the suites list to start form.
     * @param {Number} length - Maximum number of suite results to return.
     * @returns {SuiteResult[}
     */
    this.suiteResults = function(index, length) {
      return suites.slice(index, index + length)
    }

    function storeSuite(result) {
      suites.push(result)
      suites_hash[result.id] = result
    }

    /**
     * Get all of the suites in a single object, with their `id` as the key.
     * @name JsApiReporter#suites
     * @function
     * @returns {Object} - Map of suite id to {@link SuiteResult}
     */
    this.suites = function() {
      return suites_hash
    }

    let specs = []

    this.specDone = function(result) {
      specs.push(result)
    }

  }
}
