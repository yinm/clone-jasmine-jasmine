getJasmineRequireObj().util = (j$) => {
  let util = {}

  util.inherit = (childClass, parentClass) => {
    const Subclass = function() {
    }

    Subclass.prototype = parentClass.prototype
    childClass.prototype = new Subclass()
  }
}
