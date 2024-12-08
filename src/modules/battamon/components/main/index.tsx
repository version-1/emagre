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

const startPosition = 10;
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
      setResult(score, {
        time: timer.value,
        setting: obstacles.setting,
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
      </div>
    </div>
  );
}
