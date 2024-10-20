import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Ranking } from "../../models/ranking";
import { cls, join } from "@/lib/styles";

type Props = {
  data: Ranking;
  show?: boolean;
  onShow?: () => void;
  onRestart?: () => void;
  onSubmit?: (data: Ranking) => void;
};

const sort = (list: Ranking[]) => {
  const sorted = list.slice();
  sorted.sort((a, b) => {
    return b.score - a.score;
  });

  return sorted;
};

type FormProps = {
  data: Ranking;
  onSubmit?: (data: Ranking) => void;
  onBack: () => void;
};

function Form({ data, onSubmit, onBack }: FormProps) {
  const [name, setName] = useState("");
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() === "") {
          alert("名前を入力してください");
          return;
        }
        data.setName(name);
        onSubmit?.(data);
      }}
    >
      <input
        className={styles.input}
        type="text"
        placeholder="名前を入力してください"
        maxLength={10}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className={styles.button}>送信</button>
      <button
        className={join(styles.button, styles.buttonOutline)}
        onClick={onBack}
      >
        戻る
      </button>
    </form>
  );
}
export default function Rankings({ data, onRestart, onShow, onSubmit }: Props) {
  const [page, setPage] = useState("index");
  const list = [
    ...[
      { id: "1", name: "Namage", rank: 4, score: 700 },
      { id: "1", name: "Namage", rank: 5, score: 600 },
      { id: "1", name: "Namage", rank: 6, score: 500 },
      { id: "1", name: "Namage", rank: 7, score: 400 },
      { id: "1", name: "Namage", rank: 8, score: 300 },
      { id: "1", name: "Namage", rank: 9, score: 200 },
    ].map((item) => new Ranking(item)),
    data,
  ];

  const sortedList = sort(list);
  useEffect(() => {
    onShow?.();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>結果発表</h1>
          <p className={styles.message}>
            あなたのスコアは
            <span className={styles.strongMessage}>{data.rank}位 </span>
            <span className={styles.strongMessage}>{data.score}点</span>
            でした！
          </p>
        </div>
        {page === "index" ? (
          <>
            <ul className={styles.list}>
              {sortedList.map((item, index) => {
                const even = (index + 1) % 2 === 0;
                const yours = item.id === undefined;
                return (
                  <li
                    key={item.id}
                    className={cls({
                      [styles.item]: true,
                      [styles.itemEven]: !yours && even,
                      [styles.itemYours]: yours,
                    })}
                  >
                    <div className={styles.rank}>{item.rank}.</div>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.score}>{item.score}</div>
                  </li>
                );
              })}
            </ul>
            <div className={styles.footer}>
              <button
                className={styles.button}
                onClick={() => {
                  setPage("form");
                }}
              >
                ランキング送信
              </button>
              <button
                className={join(styles.button, styles.buttonOutline)}
                onClick={() => {
                  onRestart?.();
                }}
              >
                リスタート
              </button>
            </div>
          </>
        ) : null}
        {page === "form" ? (
          <Form
            data={data}
            onSubmit={onSubmit}
            onBack={() => {
              setPage("index");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
