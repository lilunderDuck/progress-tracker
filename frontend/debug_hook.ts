if (import.meta.env.DEV) {
  const originalFetch = window.fetch
  const METHOD_COLOR_REGISTRY = {
    GET: "#a6e3a1",
    POST: "#89dceb",
    PATCH: "#fab387",
    DELETE: "#f38ba8",
  }

  window.fetch = async(input: RequestInfo | URL, request) => {
    const CONSOLE_CLEAR_ALL_COLOR = ""
    const VERY_COLORFUL_LOG_MSG = [
      `%c-->%c %c${request?.method ?? "GET"}%c %c${input.toString()}%c`,
      "color:#9aa0a6",
      CONSOLE_CLEAR_ALL_COLOR,
      // @ts-ignore - request.method has the type of string, but our METHOD_COLOR_REGISTRY key here is "GET" | "POST" | ...
      `padding-inline: 5px; padding-block: 2px; border-radius: 6px; background-color:${METHOD_COLOR_REGISTRY[request?.method ?? "GET"]}; color: #11111b; font-weight:bold`,
      CONSOLE_CLEAR_ALL_COLOR,
      "color: #74c7ec",
      CONSOLE_CLEAR_ALL_COLOR
    ]
    console.log(...VERY_COLORFUL_LOG_MSG)
    
    let fetchResult!: Response
    try {
      fetchResult = await originalFetch(input, request)
    } catch(error) {
      console.error(...VERY_COLORFUL_LOG_MSG, "-", error)
      throw error
    } finally {
      // extra safely here, rethrowing doesn't stop immediately
      if (fetchResult) {
        console.log(...VERY_COLORFUL_LOG_MSG, "-", fetchResult.status, fetchResult.statusText)
      }
    }

    return fetchResult
  }
}