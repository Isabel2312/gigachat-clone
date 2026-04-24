import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import styles from './App.module.css';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className={styles.layout}>
      <Sidebar onSettings={() => setShowSettings(s => !s)} />
      <main className={styles.main}>
        <ChatWindow />
      </main>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}