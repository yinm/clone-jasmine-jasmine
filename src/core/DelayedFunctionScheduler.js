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

  }

  return DelayedFunctionScheduler
}
