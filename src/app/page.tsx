import styles from "./page.module.css";
import Link from "next/link";

const list = [
  {
    title: "バッタモン",
    description: "バッタを使った2D スクロールゲーム",
    to: "/games/battamon",
  },
  {
    title: "オンライン将棋",
    description: "将棋の対局ができる",
    to: "/games/battamon",
  },
  {
    title: "ブラックジャック",
    description: "ブラックジャックです。",
    to: "/games/battamon",
  },
  {
    title: "Github スター数 チキンレース",
    description: "OSSレポジトリのGithub スター数を集めて、ニアピンゲームをする",
    to: "/games/battamon",
  },
  {
    title: "スネークゲーム",
    description: "スネークゲームです。",
    to: "/games/battamon",
  },
  {
    title: "テトリス",
    description: "テトリスです。",
    to: "/games/battamon",
  },
  {
    title: "ブロック崩し",
    description: "テトリスです。",
    to: "/games/battamon",
  },
  {
    title: "インベーダーゲーム",
    description: "インベーダーゲームです。",
    to: "/games/battamon",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      ゲームの広場だよ
      <div className={styles.body}>
        <ul className={styles.list}>
          {list.map((item) => (
            <li key={item.to} className={styles.item}>
              <Link href={item.to}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{item.title}</h2>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.thumbnail}>
                      <div className={styles.thumbnailImage}></div>
                    </div>
                    <div className={styles.description}>{item.description}</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
