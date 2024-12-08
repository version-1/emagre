import styles from "./index.module.css";
import Image from "next/image";
import button from "@/assets/images/button.svg";
import { useController } from "@/hooks/useController";

type Props = {
  position: {
    top: string;
    right: string;
  };
};

export default function Button({ position }: Props) {
  const { push } = useController();
  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <label
          className={styles.buttonYLabel}
          onClick={() => {
            push({ type: "y" });
          }}
        >
          Y
        </label>
        <label
          className={styles.buttonXLabel}
          onClick={() => {
            push({ type: "x" });
          }}
        >
          X
        </label>
        <label
          className={styles.buttonALabel}
          onClick={() => {
            push({ type: "a" });
          }}
        >
          A
        </label>
        <label
          className={styles.buttonBLabel}
          onClick={() => {
            push({ type: "b" });
          }}
        >
          B
        </label>
        <Image
          src={button}
          alt="Y"
          className={styles.buttonY}
          onClick={() => {
            push({ type: "y" });
          }}
        />

        <Image src={button} alt="X" className={styles.buttonX} />
        <Image src={button} alt="A" className={styles.buttonA} />
        <Image src={button} alt="B" className={styles.buttonB} />
      </div>
    </div>
  );
}
