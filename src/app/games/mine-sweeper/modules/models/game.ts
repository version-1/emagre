import { Cell, createMine, createEmpty } from "./cell";
import { Flags } from "./flags";

enum GameStatus {
  initial = "initial",
  gameover = "gameover",
  finished = "finished",
}

type GameSettings = {
  size: number;
  mineCount: number;
  debug?: boolean;
};

export class Game {
  status = GameStatus.initial;
  settings: GameSettings;

  cells: Cell[][] = [];
  flags: Flags;

  constructor({
    settings,
    cells,
    flags,
  }: {
    settings: GameSettings;
    cells?: Cell[][];
    flags?: Flags;
  }) {
    this.settings = settings;
    this.cells = cells || [];
    this.flags = flags || new Flags([]);
  }

  get debug(): boolean {
    return !!this.settings.debug;
  }

  get isGameOver(): boolean {
    return this.status === GameStatus.gameover;
  }

  get isWin(): boolean {
    return this.remainingCellCount === this.settings.mineCount;
  }

  get openedCellCount(): number {
    return this.cells.reduce((acc, row) => {
      return (
        acc +
        row.reduce((acc, cell) => {
          if (cell.isOpen) {
            return acc + 1;
          }

          return acc;
        }, 0)
      );
    }, 0);
  }

  get remainingCellCount(): number {
    return this.settings.size * this.settings.size - this.openedCellCount;
  }

  gameOver(): Game {
    const clone = new Game({
      settings: this.settings,
      cells: this.cells,
    });
    clone.status = GameStatus.gameover;
    return clone;
  }

  openCell(x: number, y: number): Game {
    if (this.cells[y][x].isOpen) {
      return this;
    }

    if (this.cells[y][x].isMine) {
      const cell = this.cells[y][x].open();
      const cells = updateCells(x, y, this.cells, cell);
      const game = new Game({
        settings: this.settings,
        cells,
        flags: this.flags,
      });

      return game.gameOver();
    }

    const newCells = openCellsRecursively(x, y, this.cells);

    return new Game({
      settings: this.settings,
      cells: newCells,
      flags: this.flags,
    });
  }

  isFlagged(x: number, y: number): boolean {
    return this.flags.has(x, y);
  }

  toggleFlag(x: number, y: number): Game {
    const flags = this.flags.toggle(x, y);
    return new Game({
      settings: this.settings,
      cells: this.cells,
      flags,
    });
  }

  updateCells(x: number, y: number, newCell: Cell): Cell[][] {
    return updateCells(x, y, this.cells, newCell);
  }
}

function updateCells(
  x: number,
  y: number,
  cells: Cell[][],
  newCell: Cell,
): Cell[][] {
  return cells.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      if (x === cellIndex && y === rowIndex) {
        return newCell;
      }

      return cell;
    });
  });
}

function openCellsRecursively(x: number, y: number, cells: Cell[][]): Cell[][] {
  const cell = cells[y][x];
  if (cell.isOpen) {
    return cells;
  }

  if (cell.isMine) {
    return cells;
  }

  const newCell = cell.open();
  let newCells = updateCells(x, y, cells, newCell);
  if (newCell.hint === 0) {
    // open all empty cells
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        const cell = newCells[i]?.[j];
        const isSelf = j === x && i === y;
        if (cell && !isSelf) {
          newCells = openCellsRecursively(j, i, newCells);
        }
      }
    }
  }

  return newCells;
}

export function init(settings: GameSettings) {
  // determine mine positions
  const minePositions: [number, number][] = [];
  for (let i = 0; i < settings.mineCount; i++) {
    const x = Math.floor(Math.random() * settings.size);
    const y = Math.floor(Math.random() * settings.size);
    minePositions.push([x, y]);
  }

  // put cells
  const cells: Cell[][] = [];
  for (let i = 0; i < settings.size; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < settings.size; j++) {
      const isMine = minePositions.some(([x, y]) => x === j && y === i);
      const value = isMine ? createMine(j, i) : createEmpty(j, i);
      row.push(value);
    }
    cells.push(row);
  }

  // calculate hints
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isEmpty) {
        cell.calcHint(cells);
      }
    });
  });
  return new Game({
    settings,
    cells,
  });
}
