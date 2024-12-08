"use client";
import styles from "./index.module.css";

interface MenuItem {
  label: string;
  onClick: () => void;
}

type Props = {
  menu: MenuItem[];
  position: {
    top: string;
    right: string;
  };
};

export default function Menu({ menu, position }: Props) {
  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <div className={styles.menu}>
          {menu.map((item) => (
            <div
              key={item.label}
              className={styles.menuItem}
              onClick={item.onClick}
            >
              <div className={styles.circle}></div>
              <div className={styles.label}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
