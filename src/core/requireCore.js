const getJasmineRequireObj = (function (jasmineGlobal) {
  /* globals exports, global, module, window */
  let jasmineRequire
  
  if (typeof module !== 'undefined' && module.exports && typeof exports !== 'undefined') {
    if (typeof global !== 'undefined') {
      jasmineGlobal = global
    } else {
      jasmineGlobal = {}
    }
    jasmineRequire = exports

  } else {
    if (typeof window !== 'undefined' && typeof window.toString === 'function' && window.toString() === '[object GjsGlobal]') {
      jasmineGlobal = window
    }
    jasmineRequire = jasmineGlobal.jasmineRequire = {}
  }

  function getJasmineRequire() {
    return jasmineRequire
  }

  getJasmineRequire().core = function(jRequire) {
    let $j = {}

    jRequire.base($j, jasmineGlobal)
    // TODO: Add modules

    return $j
  }

  return getJasmineRequire
})(this)
