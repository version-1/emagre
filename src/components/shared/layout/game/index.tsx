"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import bottomBar from "@/assets/images/bottom-bar.svg";
import leftSholder from "@/assets/images/left-sholder.svg";
import rightSholder from "@/assets/images/right-sholder.svg";
import leftTrigger from "@/assets/images/left-trigger.svg";
import rightTrigger from "@/assets/images/right-trigger.svg";
import displayBackground from "@/assets/images/display-background.svg";
import displayCover from "@/assets/images/cover.svg";
import CrossButton from "@/components/shared/crossButton";
import Button from "@/components/shared/controller/button";
import Menu from "@/components/shared/controller/menu";

type Props = {
  children: React.ReactNode;
};

const menu = [
  {
    label: "遊び方",
    onClick: () => {
      alert("遊び方");
    },
  },
  {
    label: "ランキング",
    onClick: () => {
      alert("Load");
    },
  },
];

export default function Layout({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.cover}>
            <Image src={displayCover} alt="Cover Image" />
          </div>
        ) : (
          children
        )}
      </div>
      <Menu menu={menu} position={{ top: "60%", right: "2%" }} />
      <Button position={{ top: "30%", right: "2%" }} />
      <CrossButton
        position={{
          top: "35%",
          left: "5%",
        }}
      />
      <Image src={bottomBar} alt="BottomBar" className={styles.bottomBar} />
      <Image
        src={leftSholder}
        alt="LeftSholder"
        className={styles.leftSholder}
      />
      <Image
        src={rightSholder}
        alt="RightSholder"
        className={styles.rightSholder}
      />
      <Image
        src={leftTrigger}
        alt="LeftTrigger"
        className={styles.leftTrigger}
      />
      <Image
        src={rightTrigger}
        alt="RightTrigger"
        className={styles.rightTrigger}
      />
      <Image
        src={displayBackground}
        alt="DisplayBackground"
        className={styles.displayBackground}
      />
    </div>
  );
}
