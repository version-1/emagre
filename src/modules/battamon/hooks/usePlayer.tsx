import { useEffect, useState, useMemo } from "react";
import { useTimer } from "../lib/timer";

type Position = {
  x: number;
  y: number;
};

type Player = {
  position: Position;
};

const v0 = 9.8 * 4.5;
const g = 9.8 * 10;
const jumpInterval = 100;

export default function usePlayer({
  startPosition,
  groundHeight,
}: {
  startPosition: number;
  groundHeight: number;
}) {
  const timer = useTimer({ interval: jumpInterval });
  const [data, setData] = useState<Player>({
    position: {
      x: startPosition,
      y: groundHeight,
    },
  });

  const setY = (y: number) => {
    setData((prev) => {
      return {
        ...prev,
        position: {
          ...prev.position,
          y,
        },
      };
    });

    return 0;
  };

  const jump = () => {
    timer.start();
  };

  const jumping = data.position.y > groundHeight;

  useEffect(() => {
    if (timer.value <= 0) {
      return;
    }
    const currentPos = data.position.y;

    const sec = timer.value / 1000;

    // upward
    const delta = v0 * sec - (g * sec * sec) / 2;
    const nextPos = currentPos + delta;
    setY(nextPos);

    if (nextPos <= groundHeight) {
      setY(groundHeight);
      timer.stop();
      timer.reset();
    }
  }, [timer.value]);

  const body = useMemo(() => {
    const bodySize = 4;
    const base = {
      x: data.position.x,
      y: data.position.y + bodySize,
    }; // 画像の左上の点の座標

    const delta = (Math.sqrt(2) * bodySize) / 4;

    return [
      [data.position.x, data.position.y], // 左下
      [base.x + delta * 3, base.y - delta * 3], // + (Math.sqrt(2) * 36 * 3 / 4) / Math.sqrt(2). 右下の点の座標
      [base.x + bodySize, base.y], // 右上
      [base.x + delta, base.y - delta], // + (Math.sqrt(2) * 36 * 1 / 4) / Math.sqrt(2). 左上の点の座標
    ];
  }, [data.position]);

  return { data, body, jump, jumping };
}
