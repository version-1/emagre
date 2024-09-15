import { useEffect, useState, useMemo } from "react";

export type Obstacle = {
  height: number;
  position: number;
  done?: boolean;
};

const calcBody = (
  groundHeight: number,
  position: number,
  height: number,
  width: number,
) => {
  const base = { x: position, y: groundHeight + height };
  return [
    [base.x, base.y - height], // 左下の点の座標
    [base.x + width, base.y - height], // 右下の点の座標
    [base.x + width, base.y], // 右上の点の座標
    [base.x, base.y], // 左上の点の座標
  ];
};

const calcObstaclePoint = (list: Obstacle[]) => {
  return list.reduce((acc: number, item: Obstacle) => {
    return item.height * 100 + acc;
  }, 0);
};

export default function useObstacles({
  groundHeight,
  count,
  heights,
}: {
  groundHeight: number;
  count: number;
  heights: number[];
}) {
  const [data, setData] = useState<Obstacle[]>([]);
  const [history, setHistory] = useState<Obstacle[]>([]);

  const init = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const initialPos = (Math.floor(Math.random() * 60) + 40) % 100;
      items.push(initObstacle(initialPos));
    }
    setData(items);
    setHistory([]);
  };

  useEffect(() => {
    init();
  }, []);

  const initObstacle = (position: number) => {
    const height = heights[Math.floor(Math.random() * heights.length)];
    return { height, position };
  };

  const add = (n: number) => {
    return new Array(n).fill(initObstacle(100));
  };

  const pushHistory = (obst: Obstacle) => {
    const newItem = {
      ...obst,
      done: true,
    };
    setData([newItem, ...data.slice(1)]);

    setHistory((prev) => {
      return [...prev, obst];
    });
  };

  const points = useMemo(() => calcObstaclePoint(history), [history]);

  const move = (delta: number) => {
    const items = data.map((item) => {
      return {
        ...item,
        position: item.position - delta,
      };
    });

    const newItems = items.filter((it) => it.position > 0);
    if (newItems.length === 0) {
      setData(add(count));
    } else {
      setData(newItems);
    }
  };

  const body = useMemo(() => {
    return data.map((item) => {
      const obstacleWidth = 2;
      return calcBody(groundHeight, item.position, item.height, obstacleWidth);
    });
  }, [data]);

  return { data, history, points, body, move, reset: init, pushHistory };
}
