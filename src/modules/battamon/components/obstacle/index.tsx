import styles from "./index.module.css";

type Props = {
  height: number | string;
  position: number;
};

export default function Obstacle({ height, position }: Props) {
  return (
    <div
      className={styles.obstacle}
      style={{
        height: `${height}%`,
        left: `${position}%`,
      }}
    ></div>
  );
}

