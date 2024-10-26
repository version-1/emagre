import { useState } from "react";
import { Ranking, RankingParams } from "../models/ranking";

type Statuses = "clear" | "ready" | "playing" | "gameover";

export default function useGame() {
  const [status, setStatus] = useState<Statuses>("ready");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<Ranking>();

  const _setResult = (result: RankingParams) => {
    setResult(new Ranking(result));
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
