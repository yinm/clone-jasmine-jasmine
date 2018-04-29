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

}
