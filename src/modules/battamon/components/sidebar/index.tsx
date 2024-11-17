"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Ranking, flattenResults } from "../../models/ranking";
import { Result } from "../../models/result";
import { listenRankings } from "../../services/firebase";

export default function Sidebar() {
  const [rankings, setRankings] = useState<Result[]>([]);

  useEffect(() => {
    const unwatch = listenRankings(
      (rankings: Ranking[]) => {
        const list = flattenResults(rankings);
        setRankings(list);
      },
      {
        per: 10,
      },
    );

    return () => {
      unwatch();
    };
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.rankings}>
        <h2 className={styles.title}>ランキング</h2>
        <ul className={styles.list}>
          {rankings.map((item, index) => (
            <li key={index} className={styles.rankingItem}>
              <div className={styles.rank}>{item.rank}. </div>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.score}>{item.score?.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
