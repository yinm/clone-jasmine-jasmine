getJasmineRequireObj().StackTrace = function(j$) {
  function StackTrace(error) {
    let lines = error.stack
      .split('\n')
      .filter(line => line !== '')

    const extractResult = extractMessage(error.message, lines)

    if (extractResult) {
      this.message = extractResult.message
      lines = extractResult.remainder
    }

    const parseResult = tryParseFrames(lines)
    this.frames = parseResult.frames
    this.style = parseResult.style
  }

  return StackTrace
}
