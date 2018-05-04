/*
Copyright (c) 2008-2018 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const getJasmineRequireObj = (function (jasmineGlobal) {
  /* globals exports, global, module, window */
  let jasmineRequire
  
  if (typeof module !== 'undefined' && module.exports && typeof exports !== 'undefined') {
    if (typeof global !== 'undefined') {
      jasmineGlobal = global
    } else {
      jasmineGlobal = {}
    }
    jasmineRequire = exports

  } else {
    if (typeof window !== 'undefined' && typeof window.toString === 'function' && window.toString() === '[object GjsGlobal]') {
      jasmineGlobal = window
    }
    jasmineRequire = jasmineGlobal.jasmineRequire = {}
  }

  function getJasmineRequire() {
    return jasmineRequire
  }

  getJasmineRequire().core = function(jRequire) {
    let j$ = {}

    jRequire.base(j$, jasmineGlobal)
    j$.util = jRequire.util(j$)
    j$.errors = jRequire.errors()
    j$.formatErrorMsg = jRequire.formatErrorMsg()
    j$.Any = jRequire.Any(j$)
    j$.Anything = jRequire.Anything(j$)
    j$.CallTracker = jRequire.CallTracker(j$)
    j$.MockDate = jRequire.MockDate();
    j$.getClearStack = jRequire.clearStack(j$);
    j$.Clock = jRequire.Clock();
    j$.DelayedFunctionScheduler = jRequire.DelayedFunctionScheduler(j$);
    j$.Env = jRequire.Env(j$);
    j$.StackTrace = jRequire.StackTrace(j$);
    j$.ExceptionFormatter = jRequire.ExceptionFormatter(j$);
    j$.Expectation = jRequire.Expectation();
    j$.buildExpectationResult = jRequire.buildExpectationResult();
    j$.JsApiReporter = jRequire.JsApiReporter();
    j$.matchersUtil = jRequire.matchersUtil(j$);
    j$.ObjectContaining = jRequire.ObjectContaining(j$);
    j$.ArrayContaining = jRequire.ArrayContaining(j$);
    j$.ArrayWithExactContents = jRequire.ArrayWithExactContents(j$);
    j$.pp = jRequire.pp(j$);
    j$.QueueRunner = jRequire.QueueRunner(j$);
    j$.ReportDispatcher = jRequire.ReportDispatcher(j$);
    j$.Spec = jRequire.Spec(j$);
    j$.Spy = jRequire.Spy(j$);
    j$.SpyFactory = jRequire.SpyFactory(j$);
    j$.SpyRegistry = jRequire.SpyRegistry(j$);
    j$.SpyStrategy = jRequire.SpyStrategy(j$);
    j$.StringMatching = jRequire.StringMatching(j$);
    j$.UserContext = jRequire.UserContext(j$);
    j$.Suite = jRequire.Suite(j$);
    j$.Timer = jRequire.Timer();
    j$.TreeProcessor = jRequire.TreeProcessor();
    j$.version = jRequire.version();
    j$.Order = jRequire.Order();
    j$.DiffBuilder = jRequire.DiffBuilder(j$);
    j$.NullDiffBuilder = jRequire.NullDiffBuilder(j$);
    j$.ObjectPath = jRequire.ObjectPath(j$);
    j$.GlobalErrors = jRequire.GlobalErrors(j$);

    j$.Truthy = jRequire.Truthy(j$);
    j$.Falsy = jRequire.Falsy(j$);
    j$.Empty = jRequire.Empty(j$);
    j$.NotEmpty = jRequire.NotEmpty(j$);

    j$.matchers = jRequire.requireMatchers(jRequire, j$);

    return j$
  }

  return getJasmineRequire
})(this)

getJasmineRequireObj().requireMatchers = function(jRequire, j$) {
  const availableMatchers = [
    'nothing',
    'toBe',
    'toBeCloseTo',
    'toBeDefined',
    'toBeFalsy',
    'toBeGreaterThan',
    'toBeGreaterThanOrEqual',
    'toBeLessThan',
    'toBeLessThanOrEqual',
    'toBeNaN',
    'toBeNegativeInfinity',
    'toBeNull',
    'toBePositiveInfinity',
    'toBeTruthy',
    'toBeUndefined',
    'toContain',
    'toEqual',
    'toHaveBeenCalled',
    'toHaveBeenCalledBefore',
    'toHaveBeenCalledTimes',
    'toHaveBeenCalledWith',
    'toHaveClass',
    'toMatch',
    'toThrow',
    'toThrowError',
    'toThrowMatching',
  ]
  let matchers = {}

  for (let i = 0; i < availableMatchers.length; i++) {
    let name = availableMatchers[i]
    matchers[name] = jRequire[name](j$)
  }

  return matchers
}

getJasmineRequireObj().base = function(j$, jasmineGlobal) {
  j$.unimplementedMethod_ = () => {
    throw new Error('unimplemented method')
  }

  /**
   * Maximum object depth the pretty printer will print to.
   * Set this to a lower value to speed up pretty printing if you have large objects.
   * @name jasmine.MAX_PRETTY_PRINT_DEPTH
   */
  j$.MAX_PRETTY_PRINT_DEPTH = 8
  /**
   * Maximum number of array elements to display when pretty printing objects.
   * This will also limit the number of keys and values displayed for an object.
   * Elements past this number will be ellipised.
   * @name jasmine.MAX_PRETTY_PRINT_ARRAY_LENGTH
   */
  j$.MAX_PRETTY_PRINT_ARRAY_LENGTH = 50
  /**
   * Maximum number of characters to display when pretty printing objects.
   * Characters past this number will be ellipised.
   * @name jasmine.MAX_PRETTY_PRINT_CHARS
   */
  j$.MAX_PRETTY_PRINT_CHARS = 1000
  /**
   * Default number of milliseconds Jasmine will wait for an asynchronous spec to complete.
   * @name jasmine.DEFAULT_TIMEOUT_INTERVAL
   */
  j$.DEFAULT_TIMEOUT_INTERVAL = 5000

  j$.getGlobal = () => {
    return jasmineGlobal
  }

  j$.getEnv = (options) => {
    const env = j$.currentEnv_ = j$.currentEnv_ || new j$.Env(options)
    // jasmine. singletons in here (setTimeout blah blah).
    return env
  }

  j$.isArray_ = (value) => {
    return j$.isA_('Array', value)
  }

  j$.isObject_ = (value) => {
    return !j$.util.isUndefined(value) && value !== null && j$.isA_('Object', value)
  }

  j$.isString_ = (value) => {
    return j$.isA_('String', value)
  }

  j$.isNumber_ = (value) => {
    return j$.isA_('Number', value)
  }

  j$.isFunction_ = (value) => {
    return j$.isA_('Function', value)
  }

  j$.isAsyncFunction_ = (value) => {
    return j$.isA_('AsyncFunction', value)
  }

  j$.isTypedArray_ = (value) => {
    return j$.isA_('Float32Array', value) ||
      j$.isA_('Float64Array', value) ||
      j$.isA_('Int16Array', value) ||
      j$.isA_('Int32Array', value) ||
      j$.isA_('Int8Array', value) ||
      j$.isA_('Uint16Array', value) ||
      j$.isA_('Uint32Array', value) ||
      j$.isA_('Uint8Array', value) ||
      j$.isA_('Uint8ClampedArray', value)
  }

  j$.isA_ = (typeName, value) => {
    return j$.getType_(value) === `[object ${typeName}]`
  }

  j$.isError_ = (value) => {
    if (value instanceof Error) {
      return true
    }

    if (
      value &&
      value.constructor &&
      value.constructor.constructor &&
      (value instanceof (value.constructor.constructor('return this')()).Error)
    ) {
      return true
    }

    return false
  }

  j$.getType_ = (value) => {
    return Object.prototype.toString.apply(value)
  }

  j$.isDomNode = (obj) => {
    return obj.nodeType > 0
  }

  j$.isMap = (obj) => {
    return typeof jasmineGlobal.Map !== 'undefined' && obj.constructor === jasmineGlobal.Map
  }

  j$.isSet = (obj) => {
    return typeof jasmineGlobal.Set !== 'undefined' && obj.constructor === jasmineGlobal.Set
  }

  j$.isPromise = (obj) => {
    return typeof jasmineGlobal.Promise !== 'undefined' && obj.constructor === jasmineGlobal.Promise
  }

  j$.fnNameFor = (func) => {
    if (func.name) {
      return func.name
    }

    const matches = func.toString().match(/^\s*function\s*(\w+)\s*\(/) ||
      func.toString().match(/^\s*\[object\s*(\w+)Constructor\]/)

    return matches ? matches[1] : '<annonymous>'
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is an instance of the specified class/constructor.
   * @name jasmine.any
   * @function
   * @param {Constructor} clazz - The constructor to check against.
   */
  j$.any = (clazz) => {
    return new j$.Any(clazz)
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is not 'null' and not 'undefined'.
   * @name jasmine.anything
   * @function
   */
  j$.anything = () => {
    return new j$.Anything()
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is `true` or anything truthy.
   * @name jasmine.Truthy
   * @function
   */
  j$.truthy = () => {
    return new j$.Truthy()
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is `null`, `undefined`, `0`, `false` or anything falsy.
   * @name jasmine.falsy
   * @function
   */
  j$.falsy = () => {
    return new j$.Falsy()
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is empty.
   * @name jasmine.empty
   * @function
   */
  j$.empty = () => {
    return new j$.Empty()
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared is not empty.
   * @name jasmine.notEmpty
   * @function
   */
  j$.notEmpty = () => {
    return new j$.NotEmpty()
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value being compared contains at least the keys and values.
   * @name jasmine.objectContaining
   * @function
   * @param {Object} sample - The subset of properties that _must_ be in the actual.
   */
  j$.objectContaining = (sample) => {
    return new j$.objectContaining(sample)
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value is a `String` that matches the `RegExp` or `String`.
   * @name jasmine.stringMatching
   * @function
   * @param {RegExp|String} expected
   */
  j$.stringMatching = (expected) => {
    return new j$.StringMatching(expected)
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value is an `Array` that contains at least the elements in the sample.
   * @name jasmine.arrayContaining
   * @function
   * @param {Array} sample
   */
  j$.arrayContaining = (sample) => {
    return new j$.ArrayContaining(sample)
  }

  /**
   * Get a matcher, usable in any {@link matchers|matcher} that uses Jasmine's equality (e.g. {@link matchers#toEqual|toEqual}, {@link matchers#toContain|toContain}, or {@link matchers#toHaveBeenCalledWith|toHaveBeenCalledWith}),
   * that will succeed if the actual value is an `Array` that contains all of the elements in the sample in any other.
   * @name jasmine.arrayContaining
   * @function
   * @param {Array} sample
   */
  j$.arrayWithExactContents = (sample) => {
    return new j$.ArrayWithExactContents(sample)
  }

  j$.isSpy = (putativeSpy) => {
    if (!putativeSpy) {
      return false
    }

    return putativeSpy.and instanceof j$.SpyStrategy &&
      putativeSpy.calls instanceof j$.CallTracker
  }
}

getJasmineRequireObj().util = (j$) => {
  let util = {}

  util.inherit = (childClass, parentClass) => {
    const Subclass = function() {
    }

    Subclass.prototype = parentClass.prototype
    childClass.prototype = new Subclass()
  }

  util.htmlEscape = (str) => {
    if (!str) {
      return str
    }

    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  util.argsToArray = (args) => {
    let arrayOfArgs = []
    for (let i = 0; i < args.length; i++) {
      arrayOfArgs.push(args[i])
    }
    return arrayOfArgs
  }

  util.isUndefined = (obj) => {
    return obj === void 0
  }

  util.arrayContains = (array, search) => {
    let i = array.length
    while (i--) {
      if (array[i] === search) {
        return true
      }
    }

    return false
  }

  util.clone = (obj) => {
    if (Object.prototype.toString.apply(obj) === '[object Array]') {
      return obj.slice()
    }

    let cloned = {}
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        cloned[prop] = obj[prop]
      }
    }

    return cloned
  }

  util.cloneArgs = (args) => {
    let clonedArgs = []
    const argsAsArray = j$.util.argsToArray(args)
    for (let i = 0; i < argsAsArray.length; i++) {
      const str = Object.prototype.toString.apply(argsAsArray[i])
      const primitives = /^\[object (Boolean|String|RegExp|Number)/

      // All falsy values are either primitives, `null`, or `undefined`.
      if (!argsAsArray[i] || str.match(primitives)) {
        clonedArgs.push(argsAsArray[i])
      } else {
        clonedArgs.push(j$.util.clone(argsAsArray[i]))
      }
    }

    return clonedArgs
  }

  util.getPropertyDescriptor = (obj, methodName) => {
    let descriptor
    let proto = obj

    do {
      descriptor = Object.getOwnPropertyDescriptor(proto, methodName)
      proto = Object.getPrototypeOf(proto)
    } while (!descriptor && proto)

    return descriptor
  }

  util.objectDifference = (obj, toRemove) => {
    let diff = {}

    for (let key in obj) {
      if (util.has(obj, key) && !util.has(toRemove, key)) {
        diff[key] = obj[key]
      }
    }

    return diff
  }

  util.has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }

  function anyMatch(pattern, lines) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(pattern)) {
        return true
      }
    }

    return false
  }

  util.errorWithStack = () => {
    // Don't throw and catch if we don't have to, because it makes it harder
    // for users to debug their code with exception breakpoints.
    const error = new Error()

    if (error.stack) {
      return error
    }

    // But some browsers (e.g. Phantom) only provide a stack trace if we throw.
    try {
      throw new Error()
    } catch (e) {
      return e
    }
  }

  function callerFile() {
    const trace = new j$.StackTrace(util.errorWithStack())
    return trace.frames[2].file
  }

  util.jasmineFile = (() => {
    let result

    return () => {
      let trace

      if (!result) {
        result = callerFile()
      }

      return result
    }
  })()

  return util
}

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

  Spec.prototype.execute = function(onComplete, excluded) {
    const self = this

    const onStart = {
      fn(done) {
        self.onStart(self, done)
      }
    }

    const complete = {
      fn(done) {
        self.queueableFn.fn = null
        self.result.status = self.status(excluded)
        self.resultCallback(self.result, done)
      }
    }

    const fns = this.beforeAndAfterFns
    const regularFns = fns.befores.concat(this.queueableFn)

    const runnerConfig = {
      isLeaf: true,
      queueableFns: regularFns,
      cleanupFns: fns.afters,
      onException() {
        self.onException.apply(self, arguments)
      },
      onComplete() {
        onComplete(self.result.status === 'failed' && new j$.StopExecutionError('spec failed'))
      },
      userContext: this.userContext()
    }

    if (this.markedPending || excluded === true) {
      runnerConfig.queueableFns = []
      runnerConfig.cleanupFns = []
    }

    runnerConfig.queueableFns.unshift(onStart)
    runnerConfig.cleanupFns.push(complete)

    this.queueRunnerFactory(runnerConfig)
  }

  Spec.prototype.onException = function onException(e) {
    if (Spec.isPendingSpecException(e)) {
      this.pend(extractCustomPendingMessage(e))
      return
    }

    if (e instanceof j$.errors.ExpectationFailed) {
      return
    }

    this.addExpectationResult(false, {
      matcherName: '',
      passed: false,
      expected: '',
      actual: '',
      error: e
    }, true)
  }

  Spec.prototype.pend = function(message) {
    this.markedPending = true
    if (message) {
      this.result.pendingReason = message
    }
  }

  Spec.prototype.getResult = function() {
    this.result.status = this.status()
    return this.result
  }

  Spec.prototype.status = function(excluded) {
    if (excluded === true) {
      return 'excluded'
    }

    if (this.markedPending) {
      return 'pending'
    }

    if (this.result.failedExpectations.length > 0) {
      return 'failed'
    } else {
      return 'passed'
    }
  }

  Spec.prototype.getFullName = function() {
    return this.getSpecName(this)
  }

  Spec.prototype.addDeprecationWarning = function(deprecation) {
    if (typeof deprecation === 'string') {
      deprecation = { message: deprecation }
    }
    this.result.deprecationWarnings.push(this.expectationResultFactory(deprecation))
  }

  const extractCustomPendingMessage = (e) => {
    let fullMessage = e.toString()
    const boilerplateStart = fullMessage.indexOf(Spec.pendingSpecExceptionMessage)
    const boilerplateEnd = boilerplateStart + Spec.pendingSpecExceptionMessage.length

    return fullMessage.substr(boilerplateEnd)
  }

  Spec.pendingSpecExceptionMessage = '=> marked Pending'

  Spec.isPendingSpecException = (e) => {
    return !!(e && e.toString && e.toString().indexOf(Spec.pendingSpecExceptionMessage) !== -1)
  }

  return Spec
}

if (typeof window == void 0 && typeof exports == 'object') {
  /* globals exports */
  exports.Spec = jasmineRequire.Spec
}

/*jshint bitwise: false*/

getJasmineRequireObj().Order = function() {
  function Order(options) {
    this.random = 'random' in options ? options.random : true
    const seed = this.seed = options.seed || generateSeed()
    this.sort = this.random ? randomOrder : naturalOrder

    function naturalOrder(items) {
      return items
    }

    function randomOrder(items) {
      const copy = items.slice()
      copy.sort((a, b) => {
        return jenkinsHash(seed + a.id) - jenkinsHash(seed + b.id)
      })

      return copy
    }

    function generateSeed() {
      return String(Math.random()).slice(-5)
    }

    // Bob Jenkins One-at-a-Time Hash algorithm is a non-cryptographic hash function
    // used to get a different output when the key changes slighly.
    // We use your return to sort the children randomly in a consistent way ehn
    // used in conjunction with a seed

    function jenkinsHash(key) {
      let hash;
      let i;

      for (hash = i = 0; i < key.length; ++i) {
        hash += key.charCodeAt(i)
        hash += (hash << 10)
        hash ^= (hash >> 6)
      }
      hash += (hash << 3)
      hash ^= (hash >> 11)
      hash += (hash << 15)
      return hash
    }
  }

  return Order
}

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

    /**
     * Get the results for a set of specs.
     *
     * Retrievable in slices for easier serialization.
     * @name JsApiReporter#specResults
     * @funciton
     * @param {Number} index - The position in the specs list to start from.
     * @param {Number} length - Maximum number of specs results to return.
     * @returns {SpecResult[]}
     */
    this.specResults = function(index, length) {
      return specs.slice(index, index + length)
    }

    /**
     * Get all spec results.
     * @name JsApiReporter#specs
     * @function
     * @returns {SpecResult[]}
     */
    this.specs = function() {
      return specs
    }

    /**
     * Get the number of milliseconds it took for full Jasmine suite to run.
     * @name JsApiReporter#executionTime
     * @function
     * @returns {Number}
     */
    this.executionTime = function() {
      return executionTime
    }
  }

  return JsApiReporter
}

getJasmineRequireObj().errors = function() {
  function ExceptionFailed() {}

  ExceptionFailed.prototype = new Error()
  ExceptionFailed.prototype.constructor = ExceptionFailed

  return {
    ExceptionFailed: ExceptionFailed
  }
}

getJasmineRequireObj().formatErrorMsg = function() {
  function generateErrorMsg(domain, usage) {
    const usageDefinition = usage ? `\nUsage: ${usage}` : ''

    return function errorMsg(msg) {
      return `${domain} : ${msg}${usageDefinition}`
    }
  }

  return generateErrorMsg
}

getJasmineRequireObj().pp = function(j$) {
  function PrettyPrinter() {
    this.ppNestLevel_ = 0
    this.seen = []
    this.length = 0
    this.stringParts = []
  }

  function hasCustomToStirng(value) {
    // value.toString !== Object.prototype.toString if value has no custom toString but is from another context (e.g.
    // iframe, web worker)
    return j$.isFunction_(value.toString)
      && value.toString !== Object.prototype.toString
      && (value.toString() !== Object.prototype.toString.call(value))
  }

  PrettyPrinter.prototype.format = function(value) {
    this.ppNestLevel_++

    try {
      if (j$.util.isUndefined(value)) {
        this.emitScalar('undefined')
      } else if (value === null) {
        this.emitScalar('null')
      } else if (value === 0 && 1/value === -Infinity) {
        this.emitScalar('-0')
      } else if (value === j$.getGlobal()) {
        this.emitScalar('<global>')
      } else if (value.jasmineToString) {
        this.emitScalar(value.jasmineToString())
      } else if (typeof value === 'string') {
        this.emitString(value)
      } else if (j$.isSpy) {
        this.emitScalar(`spy on ${value.and.identify}`)
      } else if (value instanceof RegExp) {
        this.emitScalar(value.toString())
      } else if (typeof value === 'function') {
        this.emitScalar('Function')
      } else if (value.nodeType === 1) {
        this.emitDomElement(value)
      } else if (value.nodeType === 'number') {
        this.emitScalar('HTMLNode')
      } else if (value instanceof Date) {
        this.emitScalar(`Date(${value})`)
      } else if (j$.isSet(value)) {
        this.emitSet(value)
      } else if (j$.isMap(value)) {
        this.emitMap(value)
      } else if (j$.isTypedArray_(value)) {
        this.emitTypedArray(value)
      } else if (value.toString && typeof value === 'object' && !j$.isArray_(value) && hasCustomToStirng(value)) {
        this.emitScalar(value.toString())
      } else if (j$.util.arrayContains(this.seen, value)) {
        this.emitScalar(`<circular reference: ${j$.isArray_(value) ? 'Array' : 'Object'}>`)
      } else if (j$.isArray_(value) || j$.isA_('Object', value)) {
        this.seen.push(value)
        if (j$.isArray_(value)) {
          this.emitArray(value)
        } else {
          this.emitObject(value)
        }
        this.seen.pop()
      } else {
        this.emitScalar(value.toString())
      }
    } catch (e) {
      if (this.ppNestLevel_ > 1 || !(e instanceof MaxCharsReachedError)) {
        throw e
      }
    } finally {
      this.ppNestLevel_--
    }
  }

  PrettyPrinter.prototype.iterateObject = function(obj, fn) {
    const objKeys = keys(obj, j$.isArray_(obj))
    const isGetter = function isGetter(prop) {}

    if (obj.__lookupGetter__) {
      isGetter = function isGetter(prop) {
        const getter = obj.__lookupGetter__(prop)
        return !j$.util.isUndefined(getter) && getter !== null
      }
    }

    const length = Math.min(objKeys.length, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH)
    for (let i = 0; i < length; i++) {
      const property = objKeys[i]
      fn(property, isGetter(property))
    }

    return objKeys.length > length
  }

  PrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value)
  }

  PrettyPrinter.prototype.emitString = function(value) {
    this.append(`'${value}'`)
  }

  PrettyPrinter.prototype.emitArray = function(array) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_ARRAY_LENGTH) {
      this.append('Array')
      return
    }

    const length = Math.min(array.length, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH)
    this.append('[ ')
    for (let i = 0; i < length; i++) {
      if (i > 0) {
        this.append(', ')
      }
      this.format(array[i])
    }

    if (array.length > length) {
      this.append(', ...')
    }

    const self = this
    let first = array.length === 0
    const truncated = this.iterateObject(array, (property, isGetter) => {
      if (first) {
        first = false
      } else {
        self.append(', ')
      }

      self.formatProperty(array, property, isGetter)
    })

    if (truncated) { this.append(', ....') }

    this.append(' ]')
  }

  PrettyPrinter.prototype.emitSet = function(set) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      this.append('Set')
      return
    }
    this.append('Set( ')
    const size = Math.min(set.size, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH)
    let i = 0
    set.forEach(function(value, key) {
      if (i >= size) {
        return
      }
      if (i > 0) {
        this.append(', ')
      }
      this.format(value)

      i++
    }, this)

    if (set.size > size) {
      this.append(', ...')
    }
    this.append(' )')
  }

  PrettyPrinter.prototype.emitMap = function(map) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      this.append('Map')
      return
    }

    this.append('Map( ')
    const size = Math.min(map.size, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH)
    let i = 0
    map.forEach(function (value, key) {
      if (i >= size) {
        return
      }
      if (i > 0) {
        this.append(', ')
      }
      this.format([key,value])

      i++
    }, this)

    if (map.size > size) {
      this.append(', ...')
    }
    this.append(' )')
  }

  PrettyPrinter.prototype.emitObject = function(obj) {
    const ctor = obj.constructor
    const constructorName = typeof ctor === 'function' && obj instanceof ctor ?
      j$.fnNameFor(obj.constructor) :
      'null'

    this.append(constructorName)

    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      return
    }

    const self = this
    this.append('({ ')
    let first = true

    const truncated = this.iterateObject(obj, function(property, isGetter) {
      if (first) {
        first = false
      } else {
        self.append(', ')
      }

      self.formatProperty(obj, property, isGetter)
    })

    if (truncated) { this.append(', ...') }

    this.append(' })')
  }

  PrettyPrinter.prototype.emitTypedArray = function(arr) {
    const constructorName = j$.fnNameFor(arr.constructor)
    const limitedArray = Array.prototype.slice.call(arr, 0, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH)
    let itemsString = Array.prototype.join.call(limitedArray, ', ')

    if (limitedArray.length !== arr.length) {
      itemsString += ', ...'
    }

    this.append(`${constructorName} [ ${itemsString} ]`)
  }

  PrettyPrinter.prototype.emitDomElement = function(el) {
    const closingTag = `</${el.tagName.toLowerCase()}>`

    if (el.innerHTML === '') {
      this.append(el.outerHTML.replace(closingTag, ''))
    } else {
      const tagEnd = el.outerHTML.indexOf(el.innerHTML)
      this.append(el.outerHTML.substring(0, tagEnd))
      this.append(`...${closingTag}`)
    }
  }

  PrettyPrinter.prototype.formatProperty = function(obj, property, isGetter) {
    this.append(property)
    this.append(': ')

    if (isGetter) {
      this.append('<getter>')
    } else {
      this.format(obj[property])
    }
  }

  PrettyPrinter.prototype.append = function(value) {
    const result = truncate(value, j$.MAX_PRETTY_PRINT_CHARS - this.length)
    this.length += result.value.length
    this.stringParts.push(result.value)

    if (result.truncated) {
      throw new MaxCharsReachedError()
    }
  }

  function truncate(s, maxlen) {
    if (s.length <= maxlen) {
      return { value: s, truncated: false }
    }

    s = s.substring(0, maxlen - 4) + ' ...'
    return { value: s, trucated: true }
  }

  function MaxCharsReachedError() {
    this.message = `Exceeded ${j$.MAX_PRETTY_PRINT_CHARS} characters while pretty-printing a value`
  }
  MaxCharsReachedError.prototype = new Error()

  function keys(obj, isArray) {
    const allKeys = Object.keys ?
      Object.keys(obj) :
      (function(o) {
        let keys = []
        for (let key in o) {
          if (j$.util.has(o, key)) {
            keys.push(key)
          }
        }

        return keys
      })(obj)

    if (!isArray) {
      return allKeys
    }

    if (allKeys.length === 0) {
      return allKeys
    }

    let extraKeys = []
    for (let i = 0; i < allKeys.length; i++) {
      if (!/^\[0-9]+$/.test(allKeys[i])) {
        extraKeys.push(allKeys[i])
      }
    }

    return extraKeys
  }

  return function(value) {
    const prettyPrinter = new PrettyPrinter()
    prettyPrinter.format(value)
    return prettyPrinter.stringParts.join('')
  }
}

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

  function isFailure(args) {
    return !args[0]
  }

  return Suite
}

if (typeof window == void 0 && typeof exports == 'object') {
  /* globals exports */
  exports.Suite = jasmineRequire.Suite
}

getJasmineRequireObj().version = function() {
  return '1.0.0'
}
