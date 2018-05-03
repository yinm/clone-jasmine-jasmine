getJasmineRequireObj().pp = function(j$) {
  function PrettyPrinter() {
    this.ppNestLevel_ = 0
    this.seen = []
    this.length = 0
    this.stringParts = []
  }



  PrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value)
  }


}
