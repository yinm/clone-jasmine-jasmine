getJasmineRequireObj().requireMatchers = function(jRequire, j$) {
  const availableMatchers = [
    'nothing',
    'toBe',
    'toBeCloseTo',
    'toBeDefined',
    'toBeFalsy',
    'toBeGreaterThan',
    'toBeGreaterThanOrEqual',
    'toBeLessThan',
    'toBeLessThanOrEqual',
    'toBeNaN',
    'toBeNegativeInfinity',
    'toBeNull',
    'toBePositiveInfinity',
    'toBeTruthy',
    'toBeUndefined',
    'toContain',
    'toEqual',
    'toHaveBeenCalled',
    'toHaveBeenCalledBefore',
    'toHaveBeenCalledTimes',
    'toHaveBeenCalledWith',
    'toHaveClass',
    'toMatch',
    'toThrow',
    'toThrowError',
    'toThrowMatching',
  ]
  let matchers = {}

  for (let i = 0; i < availableMatchers.length; i++) {
    let name = availableMatchers[i]
    matchers[name] = jRequire[name](j$)
  }

  return matchers
}
