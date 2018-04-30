getJasmineRequireObj().Spec = (j$) => {
  function Spec(attrs) {
    this.expectationFactroy = attrs.expectationFactroy
    this.resultCallback = attrs.resultCallback || function() {}
    this.id = attrs.id
    this.description = attrs.description || ''
    this.queueableFn = attrs.queueableFn
    this.beforeAndAfterFns = attrs.beforeAndAfterFns || function () { return {befores: [], afters: []} }
    this.userContext = attrs.userContext || function() { return {} }
    this.onStart = attrs.onStart || function() {}
    this.getSpecName = attrs.getSpecName || function() { return '' }
    this.expectationResultFactory = attrs.expectationResultFactory || function() {}
    this.queueRunnerFactory = attrs.queueRunnerFactory || function() {}
    this.catchingExceptions = attrs.catchingExceptions || function() { return true }
    this.throwOnExpectationFailure = !!attrs.throwOnExpectationFailure

    if (!this.queueableFn.fn) {
      this.pend()
    }

    /**
     * @typedef SpecResult
     * @property {Int} id - The unique id of this spec.
     * @property {String} description - The description passed to the {@link it} that created this spec.
     * @property {String} fullName - The full description including all ancestors of this spec.
     * @property {Expectation[]} failedExpectations - The list of expectations that failed during execution of this spec.
     * @property {Expectation[]} passedExpectations - The list of expectations that passed during execution of this spec.
     * @property {Expectation[]} deprecationWarnings - The list of deprecation warnings that occurred during execution this spec.
     * @property {String} pendingReason - If the spec is {@link pending}, this will be the reason.
     * @property {String} status - Once the spec has completed, this string represents the pass/fail status of this spec.
     */
    this.result = {
      id: this.id,
      description: this.description,
      fullName: this.getFullName(),
      failedExpectations: [],
      passedExpectations: [],
      deprecationWarnings: [],
      pendingReason: '',
    }

    Spec.prototype.addExpectationResult = function(passed, data, isError) {
      const expectationResult = this.expectationResultFactory(data)
      if (passed) {
        this.result.passedExpectations.push(expectationResult)
      } else {
        this.result.failedExpectations.push(expectationResult)

        if (this.throwOnExpectationFailure && !isError) {
          throw new j$.errors.ExpectationFailed()
        }
      }
    }

    Spec.prototype.expect = function(actual) {
      return this.expectationFactroy(actual, this)
    }

  }
}
