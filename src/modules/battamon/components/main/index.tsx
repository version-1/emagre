"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import ObstacleComponent from "../obstacle";
import Rankings from "../rankings";
import playerImg from "../../assets/images/grasshopper.svg";
import useObstacles, { Obstacle } from "../../hooks/useObstacle";
import usePlayer from "../../hooks/usePlayer";
import useGame from "../../hooks/useGame";
import useScore from "../../hooks/useScore";
import { Timer } from "../../lib/timer";
import { intersect } from "@/lib/diagram";
import { cls } from "@/lib/styles";

const startPosition = 20;
const groundHeight = 20;

function displayTime(time: number) {
  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }
  return `${pad(Math.floor(time / 1000 / 60))} : ${pad(Math.floor(time / 1000) % 60)}`;
}

export default function BattamonGame() {
  const [time, setTime] = useState(0);
  const [timer] = useState(new Timer({ interval: 100 }));
  const { result, status, isPlaying, isGameover, setResult, setStatus } =
    useGame();
  const { score, update: updateScore } = useScore();
  const obstacles = useObstacles();
  const player = usePlayer({
    startPosition,
    groundHeight,
  });

  const conflict = obstacles.body.some((body) => intersect(body, player.body));
  if (process.env.NODE_ENV === "development") {
    console.log("watch state", obstacles, player);
  }

  function reset() {
    setStatus("ready");
    obstacles.reset();
    timer.reset();
  }

  function restart() {
    setStatus("playing");
    obstacles.reset();
    timer.reset();
    timer.start((t) => {
      setTime(t);
    });
  }

  useEffect(() => {
    return () => {
      timer.stop();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timer.tick) {
      obstacles.move(timer.value);
      const headObstacle = obstacles.data[0];
      if (
        headObstacle &&
        !headObstacle.done &&
        headObstacle.position < player.data.position.x
      ) {
        obstacles.pushHistory(headObstacle);
      }

      updateScore(timer.value, obstacles.history, obstacles.setting);
    }

    if (conflict) {
      timer.stop();
      setStatus("gameover");
      setResult({
        score,
      });
      return;
    }

    function onKeydown(e: KeyboardEvent) {
      e.preventDefault();
      if (e.key === " ") {
        if (!player.jumping && status === "playing") {
          player.jump();
        }
      }
    }
    document.addEventListener("keydown", onKeydown);

    if (time > 99 * 60 * 1000) {
      timer.stop();
      setStatus("clear");
    }

    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.field}>
          {isGameover ? (
            <Rankings show data={result} onRestart={reset} onSubmit={reset} />
          ) : null}
          <div className={styles.gameState}>
            <div className={styles.gameStateRow}>
              <div className={styles.gameStateLabel}>Time:</div>
              <div className={styles.gameStateValue}>{displayTime(time)}</div>
            </div>
            <div className={styles.gameStateRow}>
              <div className={styles.gameStateLabel}>Score:</div>
              <div className={styles.gameStateValue}>{score}</div>
            </div>
          </div>
          <div
            className={styles.player}
            style={{
              width: "4%",
              bottom: `${player.data.position.y}%`,
              left: `${player.data.position.x}%`,
            }}
          >
            <Image src={playerImg} alt="player" fill />
          </div>
          {obstacles.data.map((item: Obstacle, index: number) => (
            <ObstacleComponent
              key={index}
              height={item.height}
              position={item.position}
            />
          ))}
          <div className={styles.grand}></div>
        </div>
        <div className={styles.controller}>
          <div className={styles.settings}>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>速さ</label>
              <div className={styles.settingValue}>
                <span className={styles.settingValueText}>
                  {obstacles.setting.speed}
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={obstacles.setting.speed}
                  disabled={isPlaying}
                  onChange={(e) => {
                    obstacles.updateSetting({
                      speed: Number(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>障害物の発生頻度</label>
              <div className={styles.settingValue}>
                <span className={styles.settingValueText}>
                  {Math.floor(obstacles.setting.popRate * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={obstacles.setting.popRate * 100}
                  disabled={isPlaying}
                  onChange={(e) => {
                    obstacles.updateSetting({
                      popRate: Number(e.target.value) / 100,
                    });
                  }}
                />
              </div>
            </div>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>障害物の間隔</label>
              <div className={styles.settingValue}>
                <span className={styles.settingValueText}>
                  {obstacles.setting.minDistance}
                </span>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  value={obstacles.setting.minDistance}
                  disabled={isPlaying}
                  onChange={(e) => {
                    obstacles.updateSetting({
                      minDistance: Number(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.buttons}>
              <button
                className={cls({
                  [styles.button]: true,
                  [styles.buttonDisabled]: status === "playing",
                })}
                disabled={status === "playing"}
                onClick={() => {
                  if (isGameover) {
                    restart();
                    return;
                  }

                  if (timer.tick) {
                    return;
                  }

                  setStatus("playing");
                  timer.start((t) => {
                    setTime(t);
                  });
                }}
              >
                {isGameover ? "Restart" : "Start"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
