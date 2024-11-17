import { useState } from "react";

type Props = {
  interval?: number;
};

export const useTimer = ({ interval }: Props) => {
  const [value, setValue] = useState(0);
  const [timer] = useState(new Timer({ interval }));

  const start = (cb?: (v: number) => void) => {
    timer.start((t) => {
      setValue(t);
      cb?.(t);
    });
  };

  const stop = () => {
    timer.stop();
  };

  const reset = () => {
    setValue(0);
    timer.reset();
  };

  return {
    value,
    start,
    stop,
    reset,
    timer,
  };
};

export class Timer {
  id?: NodeJS.Timeout;
  value: number = 0;
  interval: number;
  step: number = 10;

  constructor({ interval = 1000 } = {}) {
    this.interval = interval;
  }

  get tick() {
    return this.id;
  }

  increment() {
    this.value += this.step;
  }

  start(cb: (t: number) => void) {
    this.id = setInterval(() => {
      this.increment();

      if (this.value % this.interval === 0) {
        cb(this.value);
      }
    }, this.step);
  }

  stop() {
    if (!this.id) {
      return;
    }

    clearInterval(this.id);
    this.id = undefined;
  }

  reset() {
    this.value = 0;
  }
}
