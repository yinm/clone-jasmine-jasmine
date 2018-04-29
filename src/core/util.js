getJasmineRequireObj().util = (j$) => {
  let util = {}

  util.inherit = (childClass, parentClass) => {
    const Subclass = function() {
    }

    Subclass.prototype = parentClass.prototype
    childClass.prototype = new Subclass()
  }

  uitl.htmlEscape = (str) => {
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

}
