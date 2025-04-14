export class Timer {
  private count: number = 0;
  private interval = 1000;

  get time() {
    return this.count * this.interval;
  }

  tick(onTick: (t: Timer) => void) {
    setTimeout(() => {
      const newTimer = new Timer();
      newTimer.count = this.count + 1;
      onTick(newTimer);
    }, this.interval);
  }

  toString() {
    const minutes = Math.floor(this.time / (60 * 1000));
    const seconds = (this.time / 1000) % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }
}
