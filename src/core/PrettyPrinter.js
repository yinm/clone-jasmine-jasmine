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


  PrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value)
  }

  PrettyPrinter.prototype.emitString = function(value) {
    this.append(`'${value}'`)
  }

}
