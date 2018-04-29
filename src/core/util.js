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
}
