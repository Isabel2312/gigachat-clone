import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { streamChatCompletion } from '../../api/gigachatApi';
import type { GigaChatMessage, Message } from '../../types/index';
import MessageComponent from '../Message/Message';
import InputField from '../InputField/InputField';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const { chats, activeChatId, isStreaming, settings, apiToken,
    addMessage, appendToLastMessage, setStreaming, renameChat, createChat } = useChatStore();
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isStreaming]);

  const handleSend = useCallback(async (text: string) => {
    if (!apiToken) { alert('Please add your GigaChat token in Settings.'); return; }

    let chatId = activeChatId;
    if (!chatId) chatId = createChat();

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };
    addMessage(chatId, userMsg);

    // Auto-name chat from first message
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.messages.length === 0) {
      renameChat(chatId, text.slice(0, 40) + (text.length > 40 ? '…' : ''));
    }

    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: Date.now() };
    addMessage(chatId, assistantMsg);
    setStreaming(true);

    abortRef.current = new AbortController();

    const history: GigaChatMessage[] = [
      { role: 'system', content: settings.systemPrompt },
      ...(chat?.messages ?? []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text },
    ];

    try {
      await streamChatCompletion(history, settings, apiToken,
        (chunk) => appendToLastMessage(chatId!, chunk),
        abortRef.current.signal
      );
    } catch (e) {
      if (e.name !== 'AbortError') appendToLastMessage(chatId!, '\n\n*[Error fetching response]*');
    } finally {
      setStreaming(false);
    }
  }, [activeChatId, chats, settings, apiToken, addMessage, appendToLastMessage, createChat, renameChat, setStreaming]);

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  if (!activeChat) {
    return (
      <div className={styles.empty}>
        <h1>GigaChat</h1>
        <p>Start a new conversation</p>
        <InputField onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} disabled={false} />
      </div>
    );
  }

  return (
    <div className={styles.window}>
      <div className={styles.messages}>
        {activeChat.messages.map(m => <MessageComponent key={m.id} message={m} />)}
        {isStreaming && activeChat.messages[activeChat.messages.length - 1]?.content === '' && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <InputField onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} disabled={false} />
    </div>
  );
}