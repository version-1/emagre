import { useState, useMemo } from "react";

export type Obstacle = {
  tick: number;
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

type ObstacleProps = {
  groundHeight: number;
  count: number;
  heights: number[];
  popRate: number;
  minDistance: number;
};

const defaultSetting: ObstacleProps = {
  groundHeight: 20,
  count: 2, // 同時に画面に出現できる障害物の数
  heights: [10, 20],
  popRate: 0.01,
  minDistance: 30,
};

export default function useObstacles() {
  const [setting, setSetting] = useState<ObstacleProps>(defaultSetting);
  const [data, setData] = useState<Obstacle[]>([]);
  const [history, setHistory] = useState<Obstacle[]>([]);

  const reset = () => {
    setData([]);
    setHistory([]);
  };

  const updateSetting = (newSetting: Partial<ObstacleProps>) => {
    setSetting((prev) => {
      return { ...prev, ...newSetting };
    });
  };

  const initObstacle = (tick: number, position: number) => {
    const height =
      setting.heights[Math.floor(Math.random() * setting.heights.length)];
    return { tick, height, position } as Obstacle;
  };

  const add = (tick: number) => {
    return initObstacle(tick, 100);
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

  const move = (tick: number, delta: number) => {
    const items = data.map((item) => {
      return {
        ...item,
        position: item.position - delta,
      } as Obstacle;
    });

    const newItems = items.filter((it) => it.position > 0);
    const last = newItems[newItems.length - 1];
    const canAdd = !last || last.position < 100 - setting.minDistance;
    const shouldPop =
      newItems.length === 0 || Math.random() > 1 - setting.popRate;
    if (setting.count > newItems.length && canAdd && shouldPop) {
      const adding = add(tick);
      setData([...newItems, adding] as Obstacle[]);
    } else {
      setData(newItems);
    }
  };

  const body = useMemo(() => {
    return data.map((item) => {
      const obstacleWidth = 2;
      return calcBody(
        setting.groundHeight,
        item.position,
        item.height,
        obstacleWidth,
      );
    });
  }, [data]);

  if (!process.env.DISABLE_DEBUG) {
    console.log("watch obstacles data", data);
  }

  return {
    data,
    history,
    points,
    body,
    move,
    reset,
    pushHistory,
    updateSetting,
  };
}
