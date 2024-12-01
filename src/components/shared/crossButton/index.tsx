import styles from "./index.module.css";
import Image from "next/image";
import crossButton from "@/assets/images/cross-button.svg";

type Props = {
  onUp?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  position: {
    top: string;
    left: string;
  };
};
export default function CrossButton({
  position,
  onUp,
  onDown,
  onLeft,
  onRight,
}: Props) {
  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <Image
          src={crossButton}
          alt="CrossButton"
          className={styles.crossButton}
        />
      </div>
    </div>
  );
}
