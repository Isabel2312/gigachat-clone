import { useChatStore } from '../../store/chatStore';
import styles from './SettingsPanel.module.css';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings, apiToken, setApiToken } = useChatStore();
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <h2>Settings</h2>
        <label>GigaChat Token<input type="password" value={apiToken}
          onChange={e => setApiToken(e.target.value)} /></label>
        <label>Model<select value={settings.model}
          onChange={e => updateSettings({ model: e.target.value })}>
          <option value="gpt-4o-mini">GPT-4o mini</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
        </select></label>
        <label>Temperature: {settings.temperature}
          <input type="range" min="0" max="2" step="0.01" value={settings.temperature}
            onChange={e => updateSettings({ temperature: Number(e.target.value) })} /></label>
        <label>Max tokens: {settings.maxTokens}
          <input type="range" min="64" max="8192" step="64" value={settings.maxTokens}
            onChange={e => updateSettings({ maxTokens: Number(e.target.value) })} /></label>
        <label>Top P: {settings.topP}
          <input type="range" min="0" max="1" step="0.01" value={settings.topP}
            onChange={e => updateSettings({ topP: Number(e.target.value) })} /></label>
        <label>Repetition penalty: {settings.repetitionPenalty}
          <input type="range" min="1" max="2" step="0.01" value={settings.repetitionPenalty}
            onChange={e => updateSettings({ repetitionPenalty: Number(e.target.value) })} /></label>
        <label>System prompt<textarea value={settings.systemPrompt}
          onChange={e => updateSettings({ systemPrompt: e.target.value })} /></label>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}