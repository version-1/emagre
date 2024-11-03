import styles from "./index.module.css";

type Props = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ left, right, children }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>{left}</div>
      <div className={styles.content}>{children}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
}
