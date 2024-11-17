const maxRankingSize = 100;

const recalculate =
  (db: FirebaseFirestore.Firestore, logger: any) => async () => {
    const rs = await db
      .collection("rankings")
      .orderBy("score", "desc")
      .limit(maxRankingSize)
      .get();
    const batch = db.batch();
    let rank = 1;
    const size = rs.docs.length;
    logger.info(`size: ${size}`, {
      structuredData: true,
      data: { rank, size },
    });
    for (let i = 0; i < size; i++) {
      const doc = rs.docs[i];
      const s = await doc.ref.collection("results").count().get();
      const count = s.data().count;
      const timestamp = Date.now();
      logger.info(`update: ${doc.id}`, {
        structuredData: true,
        data: { rank, count, timestamp },
      });
      batch.set(
        doc.ref,
        {
          rank,
          count,
          timestamp,
        },
        { merge: true },
      );
      rank = rank + count;
    }
    await batch.commit();
  };

export const triggers = [
  {
    name: "recalculateRankings",
    handler: recalculate,
  },
];

export const onCreate = (
  db: FirebaseFirestore.Firestore,
  logger: any,
): [string, (e: any) => void] => [
  "rankings/{docId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.info("Document does not exist", { structuredData: true });
      return;
    }

    const data = snapshot.data();
    if (!data) {
      logger.info("data does not exist", { structuredData: true });
      return;
    }
    logger.info("document has been changed", { structuredData: true, data });

    const calculatedCount = await incrementalUpdate(
      db,
      data.score,
      maxRankingSize,
    );
    logger.info(`${calculatedCount} was recaclulcated`, {
      structuredData: true,
      data: {
        calculatedCount,
      },
    });

    const cleanupCount = await cleanupRankings(db, maxRankingSize);
    logger.info(`${cleanupCount} was removed`, {
      structuredData: true,
      data: {
        cleanupCount,
      },
    });
  },
];

async function cleanupRankings(db: FirebaseFirestore.Firestore, size = 100) {
  const rs = await db.collection("rankings").where("rank", ">", size).get();
  const batch = db.batch();
  let count = 0;
  rs.docs.forEach(async (doc) => {
    batch.delete(doc.ref);
    count++;
  });
  await batch.commit();

  return count;
}

async function incrementalUpdate(
  db: FirebaseFirestore.Firestore,
  rank: number,
  limit = 100,
) {
  const rs = await db
    .collection("rankings")
    .where("score", "<", rank)
    .orderBy("score", "desc")
    .limit(limit)
    .get();
  const batch = db.batch();
  let count = 0;
  rs.docs.forEach(async (doc) => {
    const data = doc.data();
    batch.set(
      doc.ref,
      {
        rank: data.rank + 1,
        timestamp: Date.now(),
      },
      { merge: true },
    );
    count++;
  });
  await batch.commit();
  return count;
}
