import styles from "./page.module.css";
import app from "@/services/firebase";

export default function Home() {
  return (
    <div className={styles.page}>
      トップページ
    </div>
  );
}
