import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { resolveRankings } from "../../models/ranking";
import { Result, Setting } from "../../models/result";
import { getRankingsAround, addRanking } from "../../services/firebase";
import { cls, join } from "@/lib/styles";

type Props = {
  data?: Result;
  show?: boolean;
  onShow?: () => void;
  onRestart?: () => void;
  onSubmit?: () => void;
};

type FormProps = {
  data: Result;
  onSubmit?: (data: Result) => void;
  onBack: () => void;
};

function Form({ data, onSubmit, onBack }: FormProps) {
  const [name, setName] = useState("");
  if (!data) {
    return null;
  }
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() === "") {
          alert("名前を入力してください");
          return;
        }
        if (name.length > 10) {
          alert("名前は10文字以内で入力してください");
          return;
        }
        const newData = data.setName(name);
        onSubmit?.(newData);
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

const pages = {
  index: "index",
  form: "form",
};

export default function Rankings({ data, onRestart, onShow, onSubmit }: Props) {
  const [page, setPage] = useState(pages.index);
  const [form, setForm] = useState<Result>();
  const [list, setList] = useState<Result[]>([]);

  const _onSubmit = async (data: Result) => {
    await addRanking({
      name: data.name,
      score: data.score!,
      time: data.time!,
      setting: data.setting!,
      rank: data.rank!,
      timestamp: data.timestamp,
    });
    onSubmit?.();
  };

  useEffect(() => {
    const init = async () => {
      if (!data) {
        throw new Error("data is required");
      }

      const [before, after] = await getRankingsAround({
        score: data?.score || 0,
        per: 3,
      });
      const beforeRank = before[0]?.rank || 1;
      const beforeScore = before[0]?.score || -Infinity;
      const rank =
        data && beforeScore <= data!.score!
          ? beforeRank
          : before[0]?.nextRank || 1;
      const newData = data.parent!.setRank(rank);
      const result = newData.buildResult({
        name: "Guest",
        time: data.time,
        setting: data.setting,
        timestamp: newData.timestamp,
      });
      setForm(result);

      const list = resolveRankings(before, after, result);
      setList(list);
    };

    init();
    onShow?.();
  }, []);

  if (!form) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>結果発表</h1>
          <p className={styles.message}>
            あなたのスコアは
            <span className={styles.strongMessage}>{form.rank}位 </span>
            <span className={styles.strongMessage}>{form.score}点</span>
            でした！
          </p>
        </div>
        {page === "index" ? (
          <>
            <ul className={styles.list}>
              {list.map((item, index) => {
                const even = (index + 1) % 2 === 0;
                const yours = item.id === undefined;
                // new ranking record doesn't have id and put placeholder for it.
                return (
                  <li
                    key={item.id || "yours"}
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
                  setPage(pages.form);
                }}
              >
                ランキング送信
              </button>
              <button
                className={join(styles.button, styles.buttonOutline)}
                onClick={() => {
                  onRestart?.();
                  setPage(pages.index);
                }}
              >
                リスタート
              </button>
            </div>
          </>
        ) : null}
        {page === pages.form ? (
          <Form
            data={form}
            onSubmit={_onSubmit}
            onBack={() => {
              setPage(pages.index);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
