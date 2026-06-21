const BE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

/**
 * Gọi BE /ai/explain với Server-Sent Events streaming.
 * @param {Object} question - Dữ liệu câu hỏi từ detailedAnswers
 * @param {Function} onChunk - Callback nhận từng đoạn text stream
 * @returns {Promise<void>}
 */
export async function explainToeicQuestion(question, onChunk) {
  const response = await fetch(`${BE_URL}/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || `Lỗi server: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const json = JSON.parse(line.slice(6))
        if (json.chunk && onChunk) {
          onChunk(json.chunk)
        }
        if (json.error) {
          throw new Error(json.error)
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue
        throw e
      }
    }
  }
}
