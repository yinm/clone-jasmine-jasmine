getJasmineRequireObj().CallTracker = function(j$) {
  /**
   * @namespace Spy#calls
   */
  function CallTracker() {
    let calls = []
    let opts = {}

    this.track = function(context) {
      if (opts.cloneArgs) {
        context.args = j$.util.cloneArgs(context.args)
      }
      calls.push(context)
    }

    /**
     * Check whether this spy has been invoked.
     * @name Spy#calls#any
     * @function
     * @returns {boolean}
     */
    this.any = function() {
      return !!calls.length
    }

    /**
     * Get the number of invocations of this spy.
     * @name Spy#calls#count
     * @function
     * @returns {number}
     */
    this.count = function() {
      return calls.length
    }

    /**
     * Get the arguments that were passed to a specific invocation of this spy.
     * @name Spy#calls#argsFor
     * @function
     * @param {Integer} index The 0-based invocation index.
     * @returns {Array}
     */
    this.argsFor = function(index) {
      const call = calls[index]
      return call ? call.args : []
    }

    /**
     * Get the raw calls array for this spy.
     * @name Spy#calls#all
     * @function
     * @returns {Spy.callData[]}
     */
    this.all = function() {
      return calls
    }

    /**
     * Get all of the arguments for each invocation of this spy in the order they were received.
     * @name Spy#calls#allArgs
     * @function
     * @returns {Array}
     */
    this.allArgs = function() {
      let callArgs = []
      for (let i = 0; i < calls.length; i++) {
        callArgs.push(calls[i].args)
      }

      return callArgs
    }

    /**
     * Get the first invocation of this spy.
     * @name Spy#calls#first
     * @function
     * @returns {Spy.callData}
     */
    this.first = function() {
      return calls[0]
    }

    /**
     * Get the most recent invocation of this spy
     * @name Spy#calls#mostRecent
     * @function
     * @returns {Spy.callData}
     */
    this.mostRecent = function() {
      return calls[calls.length - 1]
    }

    /**
     * Reset this spy as if it has never been called.
     * @name Spy#calls#reset
     * @function
     */
    this.reset = function() {
      calls = []
    }

    /**
     * Set this spy to do a shallow clone of arguments passed to each invocation.
     * @name Spy#calls#saveArgumentsByValue
     * @function
     */
    this.saveArgumentsByValue = function() {
      opts.cloneArgs = true
    }

  }

  return CallTracker
}
