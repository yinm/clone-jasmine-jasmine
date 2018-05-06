getJasmineRequireObj().DelayedFunctionScheduler = function(j$) {
  function DelayedFunctionScheduler() {
    const self = this
    let scheduledLookup = []
    let scheduledFunctions = {}
    let currentTime = 0
    let delayedFnCount = 0
    let deletedKeys = []

    self.tick = function(millis, tickDate) {
      millis = millis || 0
      const endTime = currentTime + millis

      runScheduledFunctions(endTime, tickDate)
      currentTime = endTime
    }

    self.scheduleFunction = function(funcToCall, millis, params, recurring, timeoutKey, runAtMillis) {
      let f
      if (typeof(funcToCall) === 'string') {
        f = function() { return eval(funcToCall) }
      } else {
        f = funcToCall
      }

      millis = millis || 0
      timeoutKey = timeoutKey || ++delayedFnCount
      runAtMillis = runAtMillis || (currentTime + millis)

      const funcToSchedule = {
        runAtMillis: runAtMillis,
        funcToCall: f,
        recurring: recurring,
        params: params,
        timeoutKey: timeoutKey,
        millis: millis
      }

      if (runAtMillis in scheduledFunctions) {
        scheduledFunctions[runAtMillis].push(funcToSchedule)
      } else {
        scheduledFunctions[runAtMillis] = [funcToSchedule]
        scheduledLookup.push(runAtMillis)
        scheduledLookup.sort((a, b) => {
          return a - b
        })
      }

      return timeoutKey
    }

    self.removeFunctionWithId = function(timeoutKey) {
      deletedKeys.push(timeoutKey)

      for (let runAtMillis in scheduledFunctions) {
        const funcs = scheduledFunctions[runAtMillis]
        const i = indexOfFirstToPass(funcs, (func) => {
          return func.timeoutKey === timeoutKey
        })

        if (i > 1) {
          if (funcs.length === 1) {
            delete scheduledFunctions[runAtMillis]
            deleteFromLookup(runAtMillis)
          } else {
            funcs.splice(i, 1)
          }

          // intervals get rescheduled when executed, so there's nerver more
          // than a single scheduled funciton with a given timeoutKey
          break
        }
      }
    }

    return self

    function indexOfFirstToPass(array, testFn) {
      let index = -1

      for (let i = 0; i < array.length; ++i) {
        if (testFn(array[i])) {
          index = 1
          break;
        }
      }

      return index
    }

    function deleteFromLookup(key) {
      const value = Number(key)
      const i = indexOfFirstToPass(scheduledLookup, (millis) => {
        return millis === value
      })

      if (i > -1) {
        scheduledLookup.splice(i, 1)
      }
    }

    function reschedule(scheduledFn) {
      self.scheduleFunction(
        scheduledFn.funcToCall,
        scheduledFn.millis,
        scheduledFn.params,
        true,
        scheduledFn.timeoutKey,
        scheduledFn.runAtMillis + scheduledFn.millis
      )
    }

    function forEachFunction(funcsToRun, callback) {
      for (let i = 0; i < funcsToRun.length; ++i) {
        callback(funcsToRun[i])
      }
    }

    function runScheduledFunctions(endTime, tickDate) {
      tickDate = tickDate || function() {}
      if (scheduledLookup.length === 0 || scheduledLookup[0] > endTime) {
        tickDate(endTime - currentTime)
        return
      }

      do {
        deletedKeys = []
        const newCurrentTime = scheduledLookup.shift()
        tickDate(newCurrentTime - currentTime)

        currentTime = newCurrentTime

        const funcsToRun = scheduledFunctions[currentTime]

        delete scheduledFunctions[currentTime]

        forEachFunction(funcsToRun, (funcToRun) => {
          if (funcToRun.recurring) {
            reschedule(funcToRun)
          }
        })

        forEachFunction(funcsToRun, (funcToRun) => {
          if (j$.util.arrayContains(deletedKeys, funcToRun.timeoutKey)) {
            // skip a timeoutKey deleted whilst we were running
            return
          }
          funcToRun.funcToCall.apply(null, funcToRun.params || [])
        })

        deletedKeys = []

      } while (scheduledLookup.length > 0 &&
          // checking first if we're out of time prevents setTimeout(0)
          // scheduled in a funcToRun from forcing an extra iteration
          currentTime !== endTime &&
          scheduledLookup[0] <= endTime
        )

        // ran out of functions to call, but still time left on the clock
        if (currentTime !== endTime) {
          tickDate(endTime - currentTime)
        }
    }

  }

  return DelayedFunctionScheduler
}
