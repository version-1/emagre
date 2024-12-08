import styles from "./index.module.css";
import Image from "next/image";
import crossButton from "@/assets/images/cross-button.svg";
import { useController, ActionTypes } from "@/hooks/useController";

type Props = {
  position: {
    top: string;
    left: string;
  };
};
export default function CrossButton({ position }: Props) {
  const { push } = useController();
  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <Image
          src={crossButton}
          alt="CrossButton"
          className={styles.crossButton}
          fill
        />
        <div
          className={styles.up}
          onClick={() => {
            push({ type: ActionTypes.UP });
          }}
        ></div>
        <div
          className={styles.down}
          onClick={() => {
            push({ type: ActionTypes.DOWN });
          }}
        ></div>
        <div
          onClick={() => {
            push({ type: ActionTypes.LEFT });
          }}
          className={styles.left}
        ></div>
        <div
          className={styles.right}
          onClick={() => {
            push({ type: ActionTypes.RIGHT });
          }}
        ></div>
      </div>
    </div>
  );
}
