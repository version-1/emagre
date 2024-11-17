import { useState } from "react";
import { Ranking } from "../models/ranking";
import { Result, ResultParams } from "../models/result";

type Statuses = "clear" | "ready" | "playing" | "gameover";

export default function useGame() {
  const [status, setStatus] = useState<Statuses>("ready");
  const [result, setResult] = useState<Result>();

  const _setResult = (score: number, params: ResultParams) => {
    const timestamp = Date.now();
    const ranking = new Ranking({ score, timestamp, count: 1 });
    const r = new Result({
      ...params,
      id: "",
      name: "",
      timestamp,
    });
    const newResult = r.setParent(ranking)!;
    setResult(newResult);
  };

  const isGameover = status === "gameover";
  const isPlaying = status === "playing";

  return {
    status,
    result,
    isPlaying,
    isGameover,
    setStatus,
    setResult: _setResult,
  };
}
