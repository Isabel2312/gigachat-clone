import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message as MessageType } from '../../types/index';
import styles from './Message.module.css';

interface Props { message: MessageType; }

export default function Message({ message }: Props) {
  const isUser = message.role === 'user';

  const handleCopy = () => navigator.clipboard.writeText(message.content);

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.avatar}>{isUser ? 'U' : 'AI'}</div>
      <div className={styles.bubble}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        )}
        {!isUser && (
          <button className={styles.copy} onClick={handleCopy} title="Copy">⎘</button>
        )}
      </div>
    </div>
  );
}