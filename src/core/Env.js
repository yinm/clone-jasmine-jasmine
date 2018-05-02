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

  }

  return Env
}
