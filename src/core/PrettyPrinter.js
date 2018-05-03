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

}
