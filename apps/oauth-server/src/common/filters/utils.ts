type Result = {
  name: string
  messages: string[]
}

export const remapErrorFields = (messages: unknown): Array<{name: string; messages: string[]}> | unknown => {
  if (!Array.isArray(messages)) return messages
  const temp: Record<string, Array<string>> = {}
  for (const message of messages) {
    const splittedMessage = (message as string).split(' ')
    const name = splittedMessage.shift() as string
    if (!temp[name]) {
      temp[name] = [splittedMessage.join(' ')]
    } else temp[name].push(splittedMessage.join(' '))
  }

  const result: Result[] = []
  for (const [name, messages] of Object.entries(temp)) {
    result.push({
      name: name,
      messages
    })
  }
  return result
}
