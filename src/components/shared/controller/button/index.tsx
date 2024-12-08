import styles from "./index.module.css";
import Image from "next/image";
import button from "@/assets/images/button.svg";

type Props = {
  position: {
    top: string;
    right: string;
  };
};

export default function Button({ position }: Props) {
  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <label className={styles.buttonYLabel}>Y</label>
        <label className={styles.buttonXLabel}>X</label>
        <label className={styles.buttonALabel}>A</label>
        <label className={styles.buttonBLabel}>B</label>
        <Image src={button} alt="Y" className={styles.buttonY} />
        <Image src={button} alt="X" className={styles.buttonX} />
        <Image src={button} alt="A" className={styles.buttonA} />
        <Image src={button} alt="B" className={styles.buttonB} />
      </div>
    </div>
  );
}
