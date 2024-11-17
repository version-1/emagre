import { useState } from "react";
import { Ranking, RankingParams } from "../models/ranking";
import { Result } from "../models/result";

type Statuses = "clear" | "ready" | "playing" | "gameover";

const pointPerTime = 100;

const culcScore = (time: number, obstaclePoints: number) => {
  const timePoints = Math.floor(time / 1000) * pointPerTime;
  return timePoints + obstaclePoints;
};

const calcObstaclePoint = (list: Obstacle[]) => {
  return list.reduce((acc: number, item: Obstacle) => {
    return item.height * 100 + acc;
  }, 0);
};

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

  const updateScore = (time: number, obstaclePoints: number) => {
    setScore(culcScore(time, obstaclePoints));
  };

  return {
    status,
    score,
    result,
    isPlaying,
    isGameover,
    setStatus,
    updateScore,
    setResult: _setResult,
  };
}
