import { useEffect, useRef } from "react";
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
  const gameRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleRightClick(e: MouseEvent) {
      e.preventDefault();

      const clickedElement = e.target as HTMLDivElement;
      const data: { x: number; y: number } = JSON.parse(
        clickedElement?.getAttribute("data-cell") || "{}",
      );
      onChange(game.toggleFlag(data.x, data.y));
    }
    gameRef.current?.addEventListener("contextmenu", handleRightClick);

    return () => {
      gameRef.current?.removeEventListener("contextmenu", handleRightClick);
    };
  }, [game]);

  const width = game.settings.size * 32;

  return (
    <div className={styles.container} ref={gameRef}>
      <div className={styles.header} style={{ width }}>
        <div className={styles.status}>
          {game.isGameOver ? (
            <div className={styles.gameOver}>Game Over</div>
          ) : game.isWin ? (
            <div className={styles.win}>You Win!</div>
          ) : (
            <div className={styles.playing}>Playing</div>
          )}
        </div>
        <div className={styles.stats}>
          <div className={styles.state}>
            <div className={styles.label}>💣</div>
            <div className={styles.value}>{game.settings.mineCount}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🚩</div>
            <div className={styles.value}>{game.flags.length}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🪟</div>
            <div className={styles.value}>{game.remainingCellCount}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🕰️</div>
            <div className={styles.value}>00:00</div>
          </div>
        </div>
      </div>
      <div className={styles.cells} style={{ width }}>
        {game.cells.map((row: Cell[], rowIndex: number) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell: Cell, cellIndex: number) => (
              <div
                key={cellIndex}
                className={`${styles.cell} ${cell.isOpen ? styles.revealed : ""}`}
                data-cell={JSON.stringify(cell.position)}
                data-cell-debug={game.debug ? JSON.stringify(cell.state) : ""}
                onClick={() => {
                  if (game.isGameOver) {
                    return;
                  }

                  if (game.isFlagged(cell.x, cell.y)) {
                    return;
                  }
                  const newGame = game.openCell(cellIndex, rowIndex);
                  onChange(newGame);
                }}
              >
                {cell.isOpen ? (
                  <RevealedContent data={cell} />
                ) : (
                  <HiddenContent
                    data={cell}
                    flagged={game.isFlagged(cell.x, cell.y)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RevealedContent({ data }: { data: Cell }) {
  if (data.isMine) {
    return <span className={styles.mine}>💣</span>;
  }

  return <>{data.hint === 0 ? "" : data.hint}</>;
}

function HiddenContent({ flagged }: { data: Cell; flagged: boolean }) {
  return (
    <>
      {flagged ? (
        <span className={styles.flagged}>🚩</span>
      ) : (
        <span className={styles.hidden} />
      )}
    </>
  );
}
