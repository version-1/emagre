import styles from "./page.module.css";
import BattamonGame from "@/components/games/battamon";

export default function Battamon() {
  return (
    <div className={styles.container}>
      <h1>バッタモン</h1>
      <BattamonGame />
      <div className={styles.description}>
        <h2>概要</h2>
        <p>バッタモンは、バッタを使った2D スクロールゲームです。</p>
      </div>
      <div className={styles.description}>
        <h2>遊び方</h2>
        <p>バッタモンは、バッタを使った2D スクロールゲームです。</p>
      </div>
    </div>
  );
}
