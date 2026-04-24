import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, Message, Settings } from '../types/index';

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  isStreaming: boolean;
  settings: Settings;
  apiToken: string;
  createChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  appendToLastMessage: (chatId: string, chunk: string) => void;
  setStreaming: (val: boolean) => void;
  updateSettings: (s: Partial<Settings>) => void;
  setApiToken: (token: string) => void;
}

const defaultSettings: Settings = {
  model: 'gpt-4o-mini',
  temperature: 0.87,
  maxTokens: 1024,
  topP: 0.47,
  repetitionPenalty: 1.07,
  systemPrompt: 'Ты полезный ассистент.',
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      isStreaming: false,
      settings: defaultSettings,
      apiToken: '',

      createChat: () => {
        const id = crypto.randomUUID();
        const newChat: Chat = {
          id,
          title: 'New chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ chats: [newChat, ...s.chats], activeChatId: id }));
        return id;
      },

      deleteChat: (id) =>
        set((s) => ({
          chats: s.chats.filter((c) => c.id !== id),
          activeChatId: s.activeChatId === id
            ? (s.chats.find((c) => c.id !== id)?.id ?? null)
            : s.activeChatId,
        })),

      renameChat: (id, title) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === id ? { ...c, title } : c)),
        })),

      setActiveChat: (id) => set({ activeChatId: id }),

      addMessage: (chatId, message) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
              : c
          ),
        })),

      appendToLastMessage: (chatId, chunk) =>
        set((s) => ({
          chats: s.chats.map((c) => {
            if (c.id !== chatId) return c;
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === 'assistant') {
              msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
            }
            return { ...c, messages: msgs };
          }),
        })),

      setStreaming: (val) => set({ isStreaming: val }),
      updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      setApiToken: (token) => set({ apiToken: token }),
    }),
    { name: 'gigachat-storage' }
  )
);