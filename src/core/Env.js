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

    const defaultResourcesForRunnable = (id, parentRunnableId) => {
      const resources = {
        spies: [],
        customEqualityTesters: [],
        customMatchers: {},
        customSpyStrategies: {}
      }

      if (runnableResources[parentRunnableId]) {
        resources.customEqualityTesters = j$.util.clone(runnableResources[parentRunnableId].customEqualityTesters)
        resources.customMatchers = j$.util.clone(runnableResources[parentRunnableId].customMatchers)
      }

      runnableResources[id] = resources
    }

    const clearResourcesForRunnable = (id) => {
      spyRegistry.clearSpies()
      delete runnableResources[id]
    }

    const beforeAndAfterFns = (suite) => {
      return () => {
        let befores = []
        let afters = []

        while (suite) {
          befores = befores.concat(suite.beforeFns)
          afters = afters.concat(suite.afterFns)

          suite = suite.parentSuite
        }

        return {
          befores: befores.reverse(),
          afters: afters
        }
      }
    }

    const getSpecName = (spec, suite) => {
      let fullName = [spec.description]
      const suiteFullName = suite.getFullName()

      if (suiteFullName !== '') {
        fullName.unshift(suiteFullName)
      }
      return fullName.join(' ')
    }

    // TODO: we may just be able to pass in the fn instead of wrapping here
    const buildExpectationResult = j$.buildExpectationResult
    const exceptionFormatter = new j$.ExceptionFormatter()
    const expectationResultFactory = (attrs) => {
      attrs.messageFormatter = exceptionFormatter.message
      attrs.stackFormatter = exceptionFormatter.stack

      return buildExpectationResult(attrs)
    }

    const maximumSpecCallbackDepth = 20
    const currentSpecCallbackDepth = 0

    this.throwOnExpectationFailure = function(value) {
      throwOnExpectationFailure = !!value
    }

    this.throwingExpectationFailures = function() {
      return throwOnExpectationFailure
    }

    this.stopOnSpecFailure = function(value) {
      stopOnSpecFailure = !!value
    }

    this.stoppingOnSpecFailure = function() {
      return stopOnSpecFailure
    }

    this.randomizeTests = function(value) {
      random = !!value
    }

    this.randomTests = function() {
      return random
    }

    this.seed = function(value) {
      if (value) {
        seed = value
      }
      return seed
    }

    this.deprecated = function(deprecation) {
      const runnable = currentRunnable() || topSuite
      runnable.addDeprecationWarning(deprecation)
      if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error('DEPRECATION:', deprecation)
      }
    }

    const queueRunnerFactory = function(options, args) {
      let failFast = false

      if (options.isLeaf) {
        failFast = throwOnExpectationFailure
      } else if (!options.isReporter) {
        failFast = stopOnSpecFailure
      }

      options.clearStack = options.clearStack || clearStack
      options.timeout = {setTimeout: realSetTimeout, clearTimeout: realClearTimeout}
      options.fail = self.fail
      options.globalErrors = globalErrors
      options.completeOnFirstError = failFast
      options.onException = options.onException || function(e) {
        (currentRunnable() || topSuite).onException(e)
      }
      options.deprecated = self.deprecated()

      new j$.QueueRunner(options).execute(args)
    }

    const topSuite = new j$.Suite({
      env: this,
      id: getNextSuiteId(),
      description: 'Jasmine__TopLevel__Suite',
      expectationFactory: expectationFactory,
      expectationResultFactory: expectationResultFactory
    })
    defaultResourcesForRunnable(topSuite.id)
    currentDeclarationSuite = topSuite

    this.topSuite = function() {
      return topSuite
    }

    /**
     * This reporters the available reporter callback for an object passed to {@link Env#addRepoter}.
     * @interface Reporter
     * @see custom_reporter
     */
    const reporter = new j$.ReporterDispatcher([
      /**
       * `jasmmineStarted` is called after all of the specs have been loaded, but just before execution starts.
       * @function
       * @name Reporter#jasmineStarted
       * @param {JasmineStartedInfo} suiteInfo Information about the full Jasmine suite that is being run
       * @param {Function} [done] used to specify to Jasmine that this callback is asynchronous and Jasmine should wait until it has been called before moving on.
       * @returns {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'jasmineStarted',
      /**
       * When the entire suite has finished execution `jasmineDone` is called
       * @function
       * @name Reporter#jasmineDone
       * @param {JasmineDoneInfo} suiteInfo Information about the full Jasmine suite that just finished running.
       * @param {Function} [done] Used to specify to Jasmine that this callback is asynchronous and Jasmine should wait until it has been called before moving on.
       * @return {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'jasmineDone',
      /**
       * `suiteStarted` is invoked when a `describe` starts to run
       * @function
       * @name Reporter#suiteStarted
       * @param {SuiteResult} result Information about the individual {@link describe} being run
       * @param {Function} [done] Used to specify to Jasmine that this callback is asynchronous and Jasmine should wait until it has been called before moving on.
       * @returns {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'suiteStarted',
      /**
       * `suiteDone` is invoked when all of the child specs and suites for a given suite have been run
       *
       * While Jasmine doesn't require any specific functions, not defining a `suiteDone` will make it impossible for a reporter to know when a suite has failures in an `afterAll`
       * @function
       * @name Reporter#suiteDone
       * @param {SuiteResult} result
       * @param {Function} {done} Used to specify to Jasmine that this callback is asynchronous and Jasmine should wait until it has been called before moving on.
       * @returns {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'suiteDone',
      /**
       * `specStarted is invoked when an `it` starts to run (including associated `beforeEach` functions)
       * @function
       * @name Reporter#specStarted
       * @param {SpecResult} result Information about the individual {@link it} being run
       * @param {Function} [done] Used to specify to Jasmine that this callback is asynchronous and jasmine should wait until it has been called before moving on.
       * @returns {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'specStarted',
      /**
       * `specDone` is invoked when an `it` and its associated `beforeEach` and `afterEach` functions have been run.
       *
       * While Jasmine doesn't require any specific functions, not defining a `specDone` will make it impossible for a reporter to know when a spec has failed.
       * @function
       * @name Reporter#specDone
       * @param {SpecResult} result
       * @param {Function} [done] Used to specify to Jasmine that this callback is asynchronous and Jasmine should wait until it has been called before moving on.
       * @returns {} Optionally return a Promise instead of using `done` to cause Jasmine to wait for completion.
       * @see async
       */
      'specDone'
    ], queueRunnerFactory)

    this.execute = function(runnablesToRun) {
      const self = this
      installGlobalErrors()

      if (!runnablesToRun) {
        if (focusedRunnables.length) {
          runnablesToRun = focusedRunnables
        } else {
          runnablesToRun = [topSuite.id]
        }
      }

      const order = new j$.Order({
        random: random,
        seed: seed
      })

      const processor = new j$.TreeProsessor({
        tree: topSuite,
        runnableIds: runnablesToRun,
        queueRunnerFactory: queueRunnerFactory,
        nodeStart: function(suite, next) {
          currentlyExecutingSuites.push(suite)
          defaultResourcesForRunnable(suite.id, sutie.parentSuite.id)
          reporter.suiteStarted(suite.result, next)
        },
        nodeComplete: function(suite, result, next) {
          if (suite !== currentSuite()) {
            throw new Error('Tried to complete the wrong suite')
          }

          clearResourcesForRunnable(suite.id)
          currentlyExecutingSuites.pop()

          if (result.status === 'failed') {
            hasFailure = true
          }

          reporter.suiteDone(result, next)
        },
        orderChildren(node) {
          return order.sort(node.children)
        },
        excludeNode(spec) {
          return !self.specFilter(spec)
        }
      })

      if (!processor.processTree().valid) {
        throw new Error('Invalid order: would cause a beforeAll or afterAll to be run multiple times')
      }

      /**
       * Information passed to the {@link Reporter#jasmineStarted} event.
       * @typedef JasmineStartedInfo
       * @property {Int} totalSpecDefined - The total number of specs defined in this suite.
       * @property {Order} order - Information about the ordering (random or not) of this execution of the suite.
       */
      reporter.jasmineStarted({
        totalSpecDefined: totalSpecsDefined,
        order: order
      }, function() {
        currentlyExecutingSuites.push(topSuite)

        processor.execute(function() {
          clearResourcesForRunnable(topSuite.id)
          currentlyExecutingSuites.pop()
          let overallStatus
          let incompleteReason

          if (hasFailure || topSuite.result.failedExpectations.length > 0) {
            overallStatus = 'failed'
          } else if (focusedRunnables.length > 0) {
            overallStatus = 'incomplete'
            incompleteReason = 'fit() or fdescribe() was found'
          } else if (totalSpecsDefined === 0) {
            overallStatus = 'incomplete'
            incompleteReason = 'No specs found'
          } else {
            overallStatus = 'passed'
          }

          /**
           * Information passed to the {@link Reporter#jasmineDone} event.
           * @typedef JasmineDoneInfo
           * @property {OverallStatus} overallStatus - The overall result of the suite: 'passed', 'failed', or 'incomplete'.
           * @property {IncompleteReason} incompleteReason - Explanation of why the suite was incomplete.
           * @property {Order} order - Information about the ordering (random or not) of this execution of the suite.
           * @property {Expectation[]} failedExpectations - List of expectations that failed in an {@link afterAll} at the global level.
           * @property {Expectation[]} deprecationWarnings - List of deprecation warnings that occurred at the global level.
           */
          reporter.jasmineDone({
            overallStatus: overallStatus,
            incompleteReason: incompleteReason,
            order: order,
            failedExpectations: topSuite.result.failedExpectations,
            deprecationWarnings: topSuite.result.deprecationWarnings
          }, function() {})
        })
      })
    }

  }

  return Env
}
