import type { GigaChatMessage, Settings } from '../types/index';

export async function streamChatCompletion(
  messages: GigaChatMessage[],
  settings: Settings,
  token: string,
  onChunk: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  const body = {
    model: 'gpt-4o-mini',
    messages,
    temperature: settings.temperature,
    max_tokens: settings.maxTokens,
    stream: true,
  };

  const response = await fetch('/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch (e) {
        console.error(e);
      }
    }
  }
}