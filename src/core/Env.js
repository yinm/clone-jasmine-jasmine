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

    /**
     * Add a custom reporter to the Jasmine environment.
     * @name Env#addReporter
     * @function
     * @param {Reporter} reporterToAdd The reporter to be added.
     * @see custom_reporter
     */
    this.addReporter = function(reporterToAdd) {
      reporter.addReporter(reporterToAdd)
    }

    this.provideFallbackReporter = function(reporterToAdd) {
      reporter.provideFallbackReporter(reporterToAdd)
    }

    this.clearReporters = function() {
      reporter.clearReporters()
    }

    const spyFactory = new j$.SpyFactory(function() {
      const runnable = currentRunnable()

      if (runnable) {
        return runnableResources[runnable.id].customSpyStrategies
      }

      return {}
    })

    const spyRegistry = new j$.SpyRegistry({
      currentSpies() {
        if (!currentRunnable()) {
          throw new Error('Spies must be created in a before function or a spec')
        }
        return runnableResources[currentRunnable().id].spies
      },
      createSpy(name, originalFn) {
        return self.createSpy(name, originalFn)
      }
    })

    this.allowRespy = function(allow) {
      spyRegistry.allowRespy(allow)
    }

    this.spyOn = function() {
      return spyRegistry.spyOn.apply(spyRegistry, arguments)
    }

    this.spyOnProperty = function() {
      return spyRegistry.spyOnProperty.apply(spyRegistry, arguments)
    }

    this.createSpy = function(name, originalFn) {
      if (arguments.length === 1 && j$.isFunction_(name)) {
        originalFn = name
        name = originalFn.name
      }

      return spyFactory.createSpy(name, originalFn)
    }

    this.createSpyObj = function(baseName, methodNames) {
      return spyFactory.createSpyObj(baseName, methodName)
    }

    const ensureIsFunction = (fn, caller) => {
      if (!j$.isFunction_(fn)) {
        throw new Error(`${caller} expects a function argument; received ${j$.getType_(fn)}`)
      }
    }

    const ensureIsFunctionOrAsync = (fn, caller) => {
      if (!j$.isFunction_(fn) && !j$.isAsyncFunction_(fn)) {
        throw new Error(`${caller} expects a function argument; received ${j$.getType_(fn)}`)
      }
    }

    function ensureIsNotNested(method) {
      const runnable = currentRunnable()
      if (runnable !== null && runnable !== undefined) {
        throw new Error(`'${method}' should only be used in 'describe' function`)
      }
    }

    const suiteFactory = function(description) {
      const suite = new j$.Sutie({
        env: self,
        id: getNextSuiteId(),
        description: description,
        parentSuite: currentDeclarationSuite,
        expectationFactory: expectationFactory,
        expectationResultFactory: expectationResultFactory,
        throwOnExpectationFailure: throwOnExpectationFailure
      })

      return suite
    }

    this.describe = function(description, specDefinitions) {
      ensureIsNotNested('describe')
      ensureIsFunction(specDefinitions, 'describe')
      const suite = suiteFactory(description)
      if (specDefinitions.length > 0) {
        throw new Error('describe does not expect any arguments')
      }
      if (currentDeclarationSuite.markedPending) {
        suite.pend()
      }
      addSpecsToSuite(suite, specDefinitions)
      return suite
    }

    this.xdescribe = function(description, specDefinitions) {
      ensureIsNotNested('xdescribe')
      ensureIsFunction(specDefinitions, 'xdescribe')
      const suite = suiteFactory(description)
      suite.pend()
      addSpecsToSuite(suite, specDefinitions)
      return suite
    }

    let focusedRunnables = []

    this.fdescribe = function(description, specDefinitions) {
      ensureIsNotNested('fdescribe')
      ensureIsFunction(specDefinitions, 'fdescribe')
      const suite = suiteFactory(description)
      suite.isFocused = true

      focusedRunnables.push(suite.id)
      unfocusAncestor()
      addSpecsToSuite(suite, specDefinitions)

      return suite
    }

    function addSpecsToSuite(suite, specDefinitions) {
      const parentSuite = currentDeclarationSuite
      parentSuite.addChild(suite)
      currentDeclarationSuite = suite

      let declarationError = null
      try {
        specDefinitions.call(suite)
      } catch (e) {
        declarationError = e
      }

      if (declarationError) {
        suite.onException(declarationError)
      }

      currentDeclarationSuite = parentSuite
    }

    function findFocusedAncestor(suite) {
      while (suite) {
        if (suite.isFocused) {
          return suite.id
        }
        suite = suite.parentSuite
      }

      return null
    }

    function unfocusAncestor() {
      const focusedAncestor = findFocusedAncestor(currentDeclarationSuite)
      if (focusedAncestor) {
        for (let i = 0; i < focusedRunnables.length; i++) {
          if (focusedRunnables[i] === focusedAncestor) {
            focusedRunnables.splice(i, 1)
            break
          }
        }
      }
    }

    const specFactory = function(description, fn, suite, timeout) {
      totalSpecsDefined++
      const spec = new j$.Spec({
        id: getNextSpecId(),
        beforeAndAfterFns: beforeAndAfterFns(suite),
        expectationFactory: expectationFactory,
        resultCallback: specResultCallback,
        getSpecName(spec) {
          return getSpecName(spec, suite)
        },
        onStart: specStarted,
        description: description,
        expectationResultFactory: expectationResultFactory,
        queueRunnerFactory: queueRunnerFactory,
        userContext() {
          return suite.clonedSharedUserContext()
        },
        queueablefn: {
          fn: fn,
          timeout() {
            return timeout || j$.DEFAULT_TIMEOUT_INTERVAL
          }
        },
        throwOnExpectationFailure: throwOnExpectationFailure
      })

      return spec

      function specResultCallback(result, next) {
        clearResourcesForRunnable(spec.id)
        currentSpec = null

        if (result.status === 'failed') {
          hasFailure = true
        }

        reporter.specDone(result, next)
      }

      function specStarted(spec, next) {
        currentSpec = spec
        defaultResourcesForRunnable(spec.id, suite.id)
        reporter.specStarted(spec.result, next)
      }
    }

    this.it = function(description, fn, timeout) {
      ensureIsNotNested('it')
      // it() sometimes doesn't have a fn argument, so only check the type if
      // it's given.
      if (arguments.length > 1 && typeof fn !== 'undefined') {
        ensureIsFunctionOrAsync(fn, 'it')
      }
      const spec = specFactory(description, fn, currentDeclarationSuite, timeout)
      if (currentDeclarationSuite.markedPending) {
        spec.pend()
      }
      currentDeclarationSuite.addChild(spec)
      return spec
    }

    this.xit = function(description, fn, timeout) {
      ensureIsNotNested('xit')
      // xit(), like it(), doesn't always have a fn argument, so only check the
      // type when needed.
      if (arguments.length > 1 && typeof fn !== 'undefined') {
        ensureIsFunctionOrAsync(fn, 'xit')
      }
      const spec = this.it.apply(this, arguments)
      spec.pend('Temporarily disabled with xit')
      return spec
    }

    this.fit = function(description, fn, timeout) {
      ensureIsNotNested('fit')
      ensureIsFunctionOrAsync(fn, 'fit')
      const spec = specFactory(description, fn, currentDeclarationSuite, timeout)
      currentDeclarationSuite.addChild(spec)
      focusedRunnables.push(spec.id)
      unfocusAncestor()
      return spec
    }

    this.expect = function(actual) {
      if (!currentRunnable()) {
        throw new Error("'expect' was used when there was no current spec, this could be because an asynchronous test timed out")
      }

      return currentRunnable().expect(actual)
    }

    this.beforeEach = function(beforeEachFunction, timeout) {
      ensureIsNotNested('beforeEach')
      ensureIsFunctionOrAsync(beforeEachFunction, 'beforeEach')
      currentDeclarationSuite.beforeEach({
        fn: beforeEachFunction,
        timeout() {
          return timeout || j$.DEFAULT_TIMEOUT_INTERVAL
        }
      })
    }

    this.beforeAll = function(beforeAllFunction, timeout) {
      ensureIsNotNested('beforeAll')
      ensureIsFunctionOrAsync(beforeAllFunction, 'beforeAll')
      currentDeclarationSuite.beforeAll({
        fn: beforeAllFunction,
        timeout() {
          return timeout || j$.DEFAULT_TIMEOUT_INTERVAL
        }
      })
    }

    this.afterEach = function(afterEachFunction, timeout) {
      ensureIsNotNested('afterEach')
      ensureIsFunctionOrAsync(afterEachFunction, 'afterEach')
      afterEachFunction.isCleanup = true
      currentDeclarationSuite.afterEach({
        fn: afterEachFunction,
        timeout() {
          return timeout || j$.DEFAULT_TIMEOUT_INTERVAL
        }
      })
    }

    this.afterAll = function(afterAllFunction, timeout) {
      ensureIsNotNested('afterAll')
      ensureIsFunctionOrAsync(afterAllFunction, 'afterAll')
      currentDeclarationSuite.afterAll({
        fn: afterAllFunction,
        timeout() {
          return timeout || j$.DEFAULT_TIMEOUT_INTERVAL
        }
      })
    }

    this.pending = function(message) {
      let fullMessage = j$.Spec.pendingSpecExceptionMessage
      if (message) {
        fullMessage += message
      }
      throw fullMessage
    }

    this.fail = function(error) {
      if (!currentRunnable()) {
        throw new Error("'fail' was used when there was no current spec, this could be because an asynchronous test timed out")
      }

      let message = 'Failed'
      if (error) {
        message += ': '
        if (error.message) {
          message += error.message
        } else if (j$.isString_(error)) {
          message += error
        } else {
          // pretty print all kind of objects. This includes arrays.
          message += j$.pp(error)
        }
      }

      currentRunnable().addExpectationResult(false, {
        matcherName: '',
        passed: false,
        expected: '',
        actual: '',
        message: message,
        error: error && error.message ? error : null
      })

      if (self.throwingExpectationFailures()) {
        throw new Error(message)
      }
    }
  }

  return Env
}
