import { useState } from "react";
import { Ranking, RankingParams } from "../models/ranking";
import { Result } from "../models/result";

type Statuses = "clear" | "ready" | "playing" | "gameover";

export default function useGame() {
  const [status, setStatus] = useState<Statuses>("ready");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<Result>();

  const _setResult = ({ score }: { score: number }) => {
    const timestamp = Date.now();
    const ranking = new Ranking({ score, timestamp });
    const r = new Result({
      id: "",
      name: "",
      timestamp,
    });
    setResult(r.setParent(ranking)!);
  };

  const isGameover = status === "gameover";
  const isPlaying = status === "playing";

  return {
    status,
    score,
    result,
    isPlaying,
    isGameover,
    setStatus,
    setScore,
    setResult: _setResult,
  };
}
