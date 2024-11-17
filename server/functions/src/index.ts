/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";
import {
  onDocumentCreated,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as rankings from "./rankings";
initializeApp();
const db = getFirestore();

export const listenTriggers = onDocumentWritten(
  "triggers/listener",
  async (e) => {
    const snapshot = e.data?.after;
    if (!snapshot) {
      logger.info("No data associated with the event", {
        structuredData: true,
      });
      return;
    }

    const data = snapshot.data();
    if (!data) {
      logger.info("data is missing", { structuredData: true });
      return;
    }

    logger.info(`triggers: ${data.name} is called`, { structuredData: true });
    const handler = rankings.triggers.find(
      (t) => t.name === data.name,
    )?.handler;
    if (!handler) {
      logger.info("handler is missing", { structuredData: true });
      return;
    }
    await handler(db, logger)();
    await db
      .collection("triggers")
      .doc("results")
      .set(
        { [data.name]: { success: true, fnisishedAt: Date.now() } },
        { merge: true },
      );
    logger.info(`triggers: ${data.name} is done`, { structuredData: true });
  },
);

export const onCreatedRankings = onDocumentCreated(
  ...rankings.onCreate(db, logger),
);
