import { createContext, useEffect, useContext, useRef, useState } from "react";

export enum ActionTypes {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  A = "a",
  B = "b",
  X = "x",
  Y = "y",
}
type ActionType = "up" | "down" | "left" | "right" | "a" | "b" | "x" | "y";

type ActionHandler = Record<string, (action: Action) => void>;

type Controller = {
  history: Action[];
  acceptable: boolean;

  push: (action: Action) => void;
  setHandler: (handler: ActionHandler) => () => void;
};

type Action = {
  type: ActionType | string;
};

const ControllerContext = createContext<Controller | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const keyMap: Record<string, ActionType> = Object.freeze({
  ArrowDown: ActionTypes.DOWN,
  ArrowLeft: ActionTypes.LEFT,
  ArrowRight: ActionTypes.RIGHT,
  ArrowUp: ActionTypes.UP,
  w: ActionTypes.UP,
  a: ActionTypes.LEFT,
  s: ActionTypes.DOWN,
  d: ActionTypes.RIGHT,
  h: ActionTypes.X,
  j: ActionTypes.A,
  l: ActionTypes.B,
  k: ActionTypes.Y,
});

export const ControllerProvider = ({ children }: ProviderProps) => {
  const [acceptable, _setAcceptable] = useState<boolean>(true);
  const [history, setHistory] = useState<Action[]>([]);
  const [handler, setHandler] = useState<ActionHandler>({});
  const ref = useRef<HTMLDivElement>(null);

  const push = (action: Action) => {
    const handle = handler[action.type];
    handle?.(action);

    setHistory((prev) => {
      return [...prev, action].slice(0, 50); // 50 個まで保存
    });
  };

  const _setHandler = (handler: ActionHandler) => {
    setHandler(handler);
    return () => {
      setHandler({});
    };
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!acceptable) {
        return;
      }

      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        push({ type: keyMap[key] });
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [acceptable, handler]);

  return (
    <ControllerContext.Provider
      value={{
        acceptable,
        history,
        push,
        setHandler: _setHandler,
      }}
    >
      <div className="controller-provider-content" ref={ref}>
        {children}
      </div>
    </ControllerContext.Provider>
  );
};

export const useController = () => {
  const controller = useContext(ControllerContext);
  if (!controller) {
    throw new Error("useController must be used within a ControllerProvider");
  }
  return controller;
};
