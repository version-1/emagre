enum CellType {
  mine = -1,
  empty = 0,
}

type CellParams = {
  x: number;
  y: number;
  value: CellType;
};

export class Cell {
  value: CellType;
  x: number = 0;
  y: number = 0;
  hint?: number;
  isOpen: boolean = false;

  constructor(params: CellParams) {
    this.value = params.value;
    this.x = params.x;
    this.y = params.y;
  }

  get isMine(): boolean {
    return this.value === CellType.mine;
  }

  get isEmpty(): boolean {
    return this.value === CellType.empty;
  }

  open(): Cell {
    const clone = new Cell({
      x: this.x,
      y: this.y,
      value: this.value,
    });
    clone.isOpen = true;
    clone.hint = this.hint;

    return clone;
  }

  calcHint(cells: Cell[][]): number {
    if (this.hint != null) {
      return this.hint;
    }

    this.hint = 0;
    for (let i = this.y - 1; i <= this.y + 1; i++) {
      for (let j = this.x - 1; j <= this.x + 1; j++) {
        const cell = cells[i]?.[j];
        if (cell?.isMine) {
          this.hint!++;
        }
      }
    }

    return this.hint;
  }
}

export const createMine = (x: number, y: number) => {
  return new Cell({
    x,
    y,
    value: CellType.mine,
  });
};

export const createEmpty = (x: number, y: number) => {
  return new Cell({
    x,
    y,
    value: CellType.empty,
  });
};
