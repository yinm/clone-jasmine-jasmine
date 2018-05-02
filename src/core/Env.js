getJasmineRequireObj().Env = function(j$) {
  /**
   * _Note:_ Do not construct this directly, Jasmine will make one during booting.
   * @name Env
   * @classdesc The Jasmine environment
   * @constructor
   */
  function Env(options) {
    options = options || {}

    const self = this
    const global = options.global || j$.getGlobal()

    let totalSpecsDefined = 0

    const realSetTimeout = global.setTimeout
    const realClearTimeout = global.clearTimeout
    const clearStack = j$.getClearStack(global)
    this.clock = new j$.Clock(global, function() { return new j$.DelayedFunctionScheduler() }, new j$.MockDate(global))

    let runnableResources = {}

    let currentSpec = null
    let currentlyExecutingSuites = []
    let currentDeclarationSuite = null
    let throwOnExpectationFailure = false
    let stopOnSpecFailure = false
    let random = true
    let seed = null
    let hasFailure = false

    const currentSuite = () => {
      return currentlyExecutingSuites[currentlyExecutingSuites.length - 1]
    }

    const currentRunnable = () => {
      return currentSpec || currentSuite()
    }

    let globalErrors = null

    const installGlobalErrors = () => {
      if (globalErrors) {
        return
      }

      globalErrors = new j$.GlobalErrors()
      globalErrors.install()
    }

    if (!options.suppressLoadErrors) {
      installGlobalErrors()
      globalErrors.pushListener((message, filename, lineno) => {
        topSuite.result.failedExpectations.push({
          passed: false,
          globalErrorType: 'load',
          message: message,
          filename: filename,
          lineno: lineno
        })
      })
    }

    this.specFilter = () => {
      return true
    }

    this.addSpyStrategy = (name, fn) => {
      if (!currentRunnable()) {
        throw new Error('Custom spy strategies must be added in a before function or a spec')
      }

      runnableResources[currentRunnable().id].customSpyStrategies[name] = fn
    }

    this.addCustomEqualityTester = (tester) => {
      if (!currentRunnable()) {
        throw new Error('Custom Equalities must be added in a before function or a spec')
      }

      runnableResources[currentRunnable().id].customeEqualityTesters.push(tester)
    }

    this.addMatchers = (matchersToAdd) => {
      if (!currentRunnable()) {
        throw new Error('Mathcers must be added in a before function or a spec')
      }

      const customMatchers = runnableResources[currentRunnable().id].customMatchers
      for (let matcherName in matchersToAdd) {
        customMatchers[matcherName] = matchersToAdd[matcherName]
      }
    }

    j$.Expectation.addCoreMatchers(j$.matchers)

    let nextSpecId = 0
    const getNextSpecId = () => {
      return `spec${nextSpecId++}`
    }

    let nextSuiteId = 0
    const getNextSuiteId = () => {
      return `suite${nextSuiteId++}`
    }

    const expectationFactory = (actual, spec) => {
      return j$.Expectation.Factory({
        util: j$.matchersUtil,
        customEqualityTesters: runnableResources[spec.id].customEqualityTesters,
        customMatchers: runnableResources[spec.id].customMatchers,
        actual: actual,
        addExpectationResult: addExpectationResult
      })

      function addExpectationResult(passed, result) {
        return spec.addExpectationResult(passed, result)
      }
    }

  }

  return Env
}
