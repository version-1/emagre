"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import ObstacleComponent from "../obstacle";
import playerImg from "../../assets/images/grasshopper.svg";
import useObstacles, { Obstacle } from "../../hooks/useObstacle";
import usePlayer from "../../hooks/usePlayer";
import { Timer } from "../../lib/timer";
import { intersect } from "@/lib/diagram";
import { cls } from "@/lib/styles";

const startPosition = 20;
const groundHeight = 20;

const statusLabel = {
  clear: "Clear!!!!!!!!",
  ready: "Ready",
  playing: "Playing...",
  gameover: "Game Over!!!!!",
};

type Statuses = keyof typeof statusLabel;

function displayTime(time: number) {
  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }
  return `${pad(Math.floor(time / 1000 / 60))} : ${pad(Math.floor(time / 1000) % 60)}`;
}

const pointPerTime = 100;

export default function BattamonGame() {
  const [time, setTime] = useState(0);
  const [timer] = useState(new Timer({ interval: 100 }));
  const [status, setStatus] = useState<Statuses>("ready");
  const [score, setScore] = useState(0);
  const obstacles = useObstacles({
    groundHeight,
    count: 1,
    heights: [10, 20, 30],
  });
  const player = usePlayer({
    startPosition,
    groundHeight,
  });

  const conflict = obstacles.body.some((body) => intersect(body, player.body));

  useEffect(() => {
    return () => {
      timer.stop();
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (timer.tick) {
      obstacles.move(1);
      const headObstacle = obstacles.data[0];
      if (!headObstacle.done && headObstacle.position < player.data.position.x ) {
        obstacles.pushHistory(headObstacle);
      }

      const timePoints = Math.floor(timer.value / 1000) * pointPerTime;
      setScore(timePoints + obstacles.points);
    }

    if (conflict) {
      timer.stop();
      setStatus("gameover");
      return;
    }

    function onKeydown(e) {
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
      <div className={styles.meta}></div>
      <div className={styles.field}>
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
      <div className={styles.status}>
        <p className={styles.statusLabel}>{statusLabel[status]}</p>
      </div>
      <div className={styles.controller}>
        <div className={styles.buttons}>
          <button
            className={cls({
              [styles.button]: true,
              [styles.buttonDisabled]: status === "playing",
            })}
            disabled={status === "playing"}
            onClick={() => {
              if (status === "gameover") {
                setStatus("playing");
                obstacles.reset();
                timer.reset();
                timer.start((t) => {
                  setTime(t);
                });
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
            {status === "gameover" ? "Restart" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
