import styles from './TypingIndicator.module.css';
export default function TypingIndicator() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>AI</div>
      <div className={styles.dots}>
        <span/><span/><span/>
      </div>
    </div>
  );
}