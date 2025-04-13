export class Flags {
  list: [number, number][];

  constructor(list: [number, number][] = []) {
    this.list = list;
  }

  get length(): number {
    return this.list.length;
  }

  has(x: number, y: number): boolean {
    return this.list.some((flag) => flag[0] === x && flag[1] === y);
  }

  toggle(x: number, y: number): Flags {
    if (this.has(x, y)) {
      return this.remove(x, y);
    }

    return this.add(x, y);
  }

  add(x: number, y: number): Flags {
    const list = [...this.list];
    if (!this.has(x, y)) {
      list.push([x, y]);
    }

    return new Flags(list);
  }

  remove(x: number, y: number): Flags {
    return new Flags(
      this.list.filter((flag) => flag[0] !== x || flag[1] !== y),
    );
  }
}
