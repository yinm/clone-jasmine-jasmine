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

  const framePatterns = [
    // PhantomJS on Linux, Node, Chrome, IE, Edge
    // e.g. "  at QueueRunner.run (http://localhost:8888/__jasmine__/jasmine.js:4320:20)"
    // Note that the "function name" can include a surprisingly large set of
    // characters, including angle brackets and square brackets.
    { re: /^\s*at ([^\)]+) \(([^\)]+)\)$/, fnIx: 1, fileLineColIx: 2, style: 'v8' },

    // NodeJS alternate form, often mixed in with the Chrome style
    // e.g. "  at /some/path:4320:20"
    { re: /\s*at (.+)$/, fileLineColIx: 1, style: 'v8' },

    // PhantomJS on OS X, Safari, Firefox
    // e.g. "run@http://localhost:8888/__jasmine__/jasmine.js:4320:27"
    // or "http://localhost:8888/__jasmine__/jasmine.js:4320:27"
    { re: /^(([^@\s]+)@)?([^\s]+)$/, fnIx: 2, fileLineColIx: 3, style: 'webkit' }
  ]

  // regexes should capture the function name (if any) as group 1
  // and the file, line, and column as group 2.
  function tryParseFrames(lines) {
    let style = null
    const frames = lines.map((line) => {
      const convertedLine = first(framePatterns, (pattern) => {
        const overallMatch = line.match(pattern.re)

        if (!overallMatch) { return null }

        const fileLineColMatch = overallMatch[pattern.fileLineColIx].match(/^(.*):(\d+):\d+$/)
        if (!fileLineColMatch) { return null }

        style = style || pattern.style
        return {
          raw: line,
          file: fileLineColMatch[1],
          line: parseInt(fileLineColMatch[2], 10),
          func: overallMatch[pattern.fnIx]
        }
      })

      return convertedLine || { raw:line }
    })

    return {
      style: style,
      frames: frames
    }
  }

  function first(items, fn) {
    let i;
    let result;

    for (i = 0; i < items.length; i++) {
      result = fn(items[i])

      if (result) {
        return result
      }
    }
  }

  function extractMessage(message, stackLines) {
    const len = messagePrefixLength(message, stackLines)

    if (len > 0) {
      return {
        message: stackLines.slice(0, len).join('\n'),
        remainder: stackLines.slice(len)
      }
    }
  }

  function messagePrefixLength(message, stackLines) {
    if (!stackLines[0].match(/^Error/)) {
      return 0
    }

    const messageLines = message.split('\n')

    for (let i = 1; i < messageLines.length; i++) {
      if (messageLines[i] !== stackLines[i]) {
        return 0
      }
    }

    return messageLines.length
  }

  return StackTrace
}
