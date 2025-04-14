"use client";
import { useState } from "react";
import { init, Game } from "./modules/models/game";
import App from "./modules/components/app";
import styles from "./page.module.css";

export default function MineSweeper() {
  const [game, setGame] = useState<Game>(init());
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <h2 className={styles.title}>Mine Sweeper</h2>
          <div className={styles.field}>
            <App game={game} onChange={setGame} />
          </div>
        </div>
      </div>
    </div>
  );
}
