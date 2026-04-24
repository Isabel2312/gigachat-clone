import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import styles from './Sidebar.module.css';

interface Props { onSettings: () => void; }

export default function Sidebar({ onSettings }: Props) {
  const { chats, activeChatId, createChat, deleteChat, renameChat, setActiveChat } = useChatStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleNew = () => { createChat(); };
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this chat?')) deleteChat(id);
  };
  const startEdit = (id: string, title: string) => {
    setEditingId(id); setEditValue(title);
  };
  const saveEdit = (id: string) => {
    renameChat(id, editValue.trim() || 'Untitled');
    setEditingId(null);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <button className={styles.newBtn} onClick={handleNew}>+ New chat</button>
        <input className={styles.search} placeholder="Search chats…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <ul className={styles.list}>
        {filtered.map(c => (
          <li key={c.id}
            className={`${styles.item} ${c.id === activeChatId ? styles.active : ''}`}
            onClick={() => setActiveChat(c.id)}>
            {editingId === c.id ? (
              <input className={styles.editInput} value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => saveEdit(c.id)}
                onKeyDown={e => e.key === 'Enter' && saveEdit(c.id)}
                onClick={e => e.stopPropagation()} />
            ) : (
              <span className={styles.title}>{c.title}</span>
            )}
            <div className={styles.actions}>
              <button onClick={e => { e.stopPropagation(); startEdit(c.id, c.title); }}>✎</button>
              <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }}>✕</button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.bottom}>
        <button className={styles.settingsBtn} onClick={onSettings}>⚙ Settings</button>
      </div>
    </aside>
  );
}