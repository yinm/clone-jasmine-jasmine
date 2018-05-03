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



  PrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value)
  }

  PrettyPrinter.prototype.emitString = function(value) {
    this.append(`'${value}'`)
  }

}
