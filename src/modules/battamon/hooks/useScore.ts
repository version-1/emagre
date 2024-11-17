import { useState } from "react";
import { Obstacle } from "./useObstacle";

const pointPerTime = 100;
const speedBonuses = [0, 5, 10, 10, 0];

const culcScore = (time: number, obstaclePoints: number) => {
  const timePoints = Math.floor(time / 1000) * pointPerTime;
  return timePoints + obstaclePoints;
};

const calcBonus = (setting: Setting) => {
  return (
    100 -
    setting.minDistance +
    Math.floor((setting.popRate * 100) / 3) +
    speedBonuses[setting.speed - 1]
  );
};

const calcObstaclePoint = (list: Obstacle[], bonus: number) => {
  return list.reduce((acc: number, item: Obstacle) => {
    return item.height * 100 + bonus + acc;
  }, 0);
};

type Setting = {
  minDistance: number;
  popRate: number;
  speed: number;
};

export default function useScoree() {
  const [score, setScore] = useState(0);

  const update = (time: number, obstacles: Obstacle[], setting: Setting) => {
    const bonus = calcBonus(setting);
    const obstaclePoints = calcObstaclePoint(obstacles, bonus);
    const value = culcScore(time, obstaclePoints);
    setScore(value);
  };

  return {
    score,
    update,
  };
}
