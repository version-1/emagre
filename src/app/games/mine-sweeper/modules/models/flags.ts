export class Flags {
  values = new Map<string, { x: number; y: number }>();

  constructor(list: [number, number][] = []) {
    this.values = new Map(
      list.map((flag) => {
        return [`${flag[0]}-${flag[1]}`, { x: flag[0], y: flag[1] }];
      }),
    );
  }

  get length(): number {
    return this.values.size;
  }

  get clone(): Flags {
    const list = Array.from(this.values.values()).map((flag) => {
      return [flag.x, flag.y] as [number, number];
    });
    return new Flags(list);
  }

  has(x: number, y: number): boolean {
    return this.values.has(`${x}-${y}`);
  }

  toggle(x: number, y: number): Flags {
    if (this.has(x, y)) {
      return this.remove(x, y);
    }

    return this.add(x, y);
  }

  add(x: number, y: number): Flags {
    if (this.has(x, y)) {
      return this;
    }

    const clone = this.clone;
    clone.values.set(`${x}-${y}`, { x, y });
    return clone;
  }

  remove(x: number, y: number): Flags {
    if (!this.has(x, y)) {
      return this;
    }
    const clone = this.clone;
    clone.values.delete(`${x}-${y}`);
    return clone;
  }
}
