import { Game } from "../../models/game";
import { Cell } from "../../models/cell";
import styles from "./index.module.css";

export default function GameApp({
  game,
  onChange,
}: {
  game: Game;
  onChange: (game: Game) => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.cells}>
        {game.cells.map((row: Cell[], rowIndex: number) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell: Cell, cellIndex: number) => (
              <div
                key={cellIndex}
                className={`${styles.cell} ${cell.isOpen ? styles.revealed : ""}`}
                data-cell={JSON.stringify({
                  cellIndex,
                  rowIndex,
                  isOpen: cell.isOpen,
                  isMine: cell.isMine,
                  hint: cell.hint,
                })}
                onClick={() => {
                  if (game.isGameOver) {
                    return;
                  }
                  const newGame = game.openCell(cellIndex, rowIndex);
                  onChange(newGame);
                }}
              >
                {cell.isOpen ? (cell.isMine ? "💣" : cell.hint) : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
