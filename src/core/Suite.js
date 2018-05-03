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

  Suite.prototype.afterEach = function(fn) {
    this.afterFns.unshift(fn)
  }

  Suite.prototype.afterAll = function(fn) {
    // TODO: ここはpushではない？
    this.afterAllFns.unshift(fn)
  }

  function removeFns(queueableFns) {
    for (let i = 0; i < queueableFns.length; i++) {
      queueableFns[i].fn = null
    }
  }

  Suite.prototype.cleanupBeforeAfter = function() {
    removeFns(this.beforeAllFns)
    removeFns(this.afterAllFns)
    removeFns(this.beforeFns)
    removeFns(this.afterFns)
  }

  Suite.prototype.addChild = function(child) {
    this.children.push(child)
  }

  Suite.prototype.status = function() {
    if (this.markedPending) {
      return 'pending'
    }

    if (this.result.failedExpectations.length > 0) {
      return 'failed'
    } else {
      return 'passed'
    }
  }

  Suite.prototype.canBeReentered = function() {
    return this.beforeAllFns.length === 0 && this.afterAllFns.length === 0
  }

  Suite.prototype.getResult = function() {
    this.result.status = this.status()
    return this.result
  }

  Suite.prototype.sharedUserContext = function() {
    if (!this.sharedUserContext) {
      this.sharedUserContext = this.parentSuite ?
        this.parentSuite.clonedSharedUserContext() :
        new j$.UserContext()
    }

    return this.sharedUserContext
  }

  Suite.prototype.clonedSharedUserContext = function() {
    return j$.UserContext.fromExsiting(this.sharedUserContext())
  }

  Suite.prototype.onException = function() {
    if (arguments[0] instanceof j$.errors.ExpectationFailed) {
      return
    }

    const data = {
      matcherName: '',
      passed: false,
      expected: '',
      actual: '',
      error: arguments[0]
    }
    const failedExpectation = this.expectationResultFactory(data)

    if (!this.parentSuite) {
      failedExpectation.globalErrorType = 'afterAll'
    }

    this.result.failedExpectations.push(failedExpectation)
  }

  Suite.prototype.addExpectationResult = function() {
    if (isFailure(arguments)) {
      const data = arguments[1]
      this.result.failedExpectations.push(this.expectationResultFactory(data))
      if (this.throwOnExpectationFailure) {
        throw new j$.errors.ExpectationFailed()
      }
    }
  }

  Suite.prototype.addDeprecationWarning = function(deprecation) {
    if (typeof deprecation === 'string') {
      deprecation = { message: deprecation }
    }

    this.result.deprecationWarnings.push(this.expectationResultFactory(deprecation))
  }

  return Suite
}
