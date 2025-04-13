import { useEffect, useState, useRef } from "react";
import { init, Game, GameDifficulty } from "../../models/game";
import { Cell } from "../../models/cell";
import { Timer } from "../../models/timer";
import styles from "./index.module.css";

export default function GameApp({
  game,
  onChange,
}: {
  game: Game;
  onChange: (game: Game) => void;
}) {
  const [difficulty, setDifficulty] = useState(game.settings.difficulty);
  const [timer, setTimer] = useState(new Timer());
  const gameRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!game.isPlaying) {
      return;
    }
    timer.tick((nextTimer: Timer) => {
      setTimer(nextTimer);
    });
  }, [game, timer]);

  const width = game.settings.size * 32;

  return (
    <div className={styles.container} ref={gameRef}>
      <div className={styles.header} style={{ width }}>
        <div className={styles.status}>
          {game.isGameOver ? (
            <div className={styles.gameOver}>Game Over</div>
          ) : game.isFinished ? (
            <div className={styles.win}>You Win!</div>
          ) : game.isPlaying ? (
            <div className={styles.playing}>Playing</div>
          ) : (
            <div className={styles.start}>Ready?</div>
          )}
        </div>
        <div className={styles.stats}>
          <div className={styles.state}>
            <div className={styles.value}>
              <select
                value={difficulty}
                onChange={(e) => {
                  if (game.isPlaying) {
                    return;
                  }
                  const d = e.target.value as GameDifficulty;
                  setDifficulty(d);
                  onChange(init(d));
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>💣</div>
            <div className={styles.value}>{game.settings.mineCount}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🚩</div>
            <div className={styles.value}>{game.flags.length}</div>
          </div>
          <div className={styles.state}>
            <div className={styles.label}>🕰️</div>
            <div className={styles.value}>{timer.toString()}</div>
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
                data-cell-debug={game.debug ? JSON.stringify(cell.state) : ""}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!game.isPlaying) {
                    return;
                  }
                  onChange(game.toggleFlag(cell.x, cell.y));
                }}
                onClick={() => {
                  if (game.isGameOver || game.isFinished) {
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
    return <>💣</>;
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
