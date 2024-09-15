import styles from "./page.module.css";
import BattamonGame from "@/modules/battamon/components/main";

export default function Battamon() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>バッタモン</h1>
      </div>
      <BattamonGame />
      <div className={styles.footer}>
        <div className={styles.description}>
          <h2 className={styles.sectionTitle}>概要・ストーリー</h2>
          <p className={styles.descriptionText}>
            バッタモンは、バッタを使った2D スクロールゲームです。
          </p>
          <p className={styles.descriptionText}>
            遠い未来、地球は科学技術の進歩により、人工生命体「バッタモン」が誕生しました。彼らはエネルギーを蓄えるために、植物の力を借りて生きています。しかし、ある日、邪悪な科学者が彼らのエネルギー源を奪うために、異次元からモンスターを呼び寄せました。このモンスターたちはバッタモンたちの世界を荒らし、植物を枯らしてしまいました。
          </p>
          <p className={styles.descriptionText}>
            主人公は、バッタモンのリーダー「ゼン」。彼は仲間たちと共に、自分たちの故郷を守るため、邪悪な科学者の元へ向かう旅に出ることを決意します。旅の途中で、様々な障害物が立ちはだかります。ゼンは、仲間たちと協力して、障害物を避けながら、邪悪な科学者の元へたどり着くことができるでしょうか？
          </p>
        </div>
        <div className={styles.howToPlay}>
          <h2 className={styles.sectionTitle}>遊び方</h2>
          <p className={styles.descriptionText}>
            ・開始ボタンをクリックしてゲーム開始
          </p>
          <p className={styles.descriptionText}>
            ・Space: ジャンプ をして障害物を避ける
          </p>
          <p className={styles.descriptionText}>
            ・障害物にぶつかるとゲームオーバー
          </p>
        </div>
      </div>
    </div>
  );
}
