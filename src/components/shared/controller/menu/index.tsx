"use client";
import styles from "./index.module.css";
import { useController } from "@/hooks/useController";

interface MenuItem {
  label: string;
  actionType: string;
}

type Props = {
  menu: MenuItem[];
  position: {
    top: string;
    right: string;
  };
};

export default function Menu({ menu, position }: Props) {
  const { push } = useController();

  return (
    <div className={styles.container} style={{ ...position }}>
      <div className={styles.content}>
        <div className={styles.menu}>
          {menu.map((item) => (
            <div
              key={item.label}
              className={styles.menuItem}
              onClick={() => {
                push({ type: item.actionType });
              }}
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
