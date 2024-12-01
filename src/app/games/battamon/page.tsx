import styles from "./page.module.css";
import BattamonGame from "@/modules/battamon/components/main";
import Layout from "@/components/shared/layout/game";

export default function Battamon() {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.content}>
            <BattamonGame />
          </div>
        </div>
      </div>
    </Layout>
  );
}
