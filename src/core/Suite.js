getJasmineRequireObj().Suite = function(j$) {
  function Suite(attrs) {
    this.env = attrs.env
    this.id = attrs.id
    this.parentSuite = attrs.parentSuite
    this.description = attrs.description
    this.expectationFactroy = attrs.expectationFactory
    this.expectationResultFactory = attrs.expectationResultFactory
    this.throwOnExpectationFailure = !!attrs.throwOnExpectationFailure

    this.beforeFns = []
    this.afterFns = []
    this.beforeAllFns = []
    this.afterAllFns = []

    this.children = []

    /**
     * @typedef SuiteResult
     * @property {Int} id - The unique id of this suite.
     * @property {String} description - The description text passed to the {@link describe} that made this suite.
     * @property {String} fullName - the full description including all ancestors of this suite.
     * @property {Expectation[]} failedExpectations - The list of expectations that failed in an {@link afterAll} for this suite.
     * @property {Expectation[]} deprecationWarnings - The list of deprecation warnings that occurred on this suite.
     * @property {String} status - Once the suite has completed, this string represents the pass/fail status of this suite.
     */
    this.result = {
      id : this.id,
      description: this.description,
      fullName: this.getFullName(),
      failedExpectations: [],
      deprecationWarnings: []
    }
  }

  Suite.prototype.expect = function(actual) {
    return this.expectationFactroy(actual, this)
  }

  Suite.prototype.getFullName = function() {
    let fullName = []
    for (let parentSuite = this; parentSuite; parentSuite = parentSuite.parentSuite) {
      if (parentSuite.parentSuite) {
        fullName.unshift(parentSuite.description)
      }
    }

    return fullName.join(' ')
  }

  Suite.prototype.pend = function() {
    this.markedPending = true
  }

  Suite.prototype.beforeEach = function(fn) {
    this.beforeFns.unshift(fn)
  }

  Suite.prototype.beforeAll = function(fn) {
    this.beforeAllFns.push(fn)
  }

  return Suite
}
