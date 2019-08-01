def ResultOrExceptionMsg(callee):
    try:
        return callee()
    except e:
        return e.Message

def SplitByEndLineAndGetSince(text, sinceLineNumber):
    return split(text, ["\r\n", "\n\r", "\n"])[sinceLineNumber..].Join("\r\n")


def SplitByEndLineAndGetLine(text, lineNumber):
    return split(text, ["\r\n", "\n\r", "\n"])[lineNumber]

