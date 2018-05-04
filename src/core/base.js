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
