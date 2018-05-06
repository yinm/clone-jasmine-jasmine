getJasmineRequireObj().errors = function() {
  function ExceptionFailed() {}

  ExceptionFailed.prototype = new Error()
  ExceptionFailed.prototype.constructor = ExceptionFailed

  return {
    ExceptionFailed: ExceptionFailed
  }
}
