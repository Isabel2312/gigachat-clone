import { useState, useRef } from 'react';
import styles from './InputField.module.css';

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export default function InputField({ onSend, onStop, isStreaming, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <textarea ref={textareaRef} className={styles.textarea}
          value={value} onChange={handleInput} onKeyDown={handleKey}
          placeholder="Message GigaChat…" rows={1} />
        {isStreaming ? (
          <button className={`${styles.btn} ${styles.stop}`} onClick={onStop}>■ Stop</button>
        ) : (
          <button className={styles.btn} onClick={handleSend} disabled={!value.trim() || disabled}>↑</button>
        )}
      </div>
      <p className={styles.hint}>Shift+Enter for new line</p>
    </div>
  );
}