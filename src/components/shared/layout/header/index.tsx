import styles from "./index.module.css";
import Image from "next/image";
import logoImage from "@/assets/emagre-logo-large.png";

export default function Header() {
  if (true) {
    return null;
  }
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Image
          className={styles.logoImage}
          src={logoImage}
          alt="Logo"
          width={24}
        />
        <div className={styles.logoText}>Emagre</div>
      </div>
    </header>
  );
}
