import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  getCountFromServer,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/services/firebase";
import { Ranking } from "../../models/ranking";

const namespaces = {
  rankings: "rankings",
};

export async function addRanking({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  const collref = collection(db, namespaces.rankings);
  const q = query(
    collref,
    orderBy("score", "desc"),
    where("score", ">", score),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  let rank = 1;
  if (querySnapshot.size > 0) {
    const prev = querySnapshot.docs[0].data();
    const prevRankQuery = query(collref, where("score", "==", prev.score));
    const qs = await getCountFromServer(prevRankQuery);
    debugger
    const prevRankCounts = qs.data().count;
    rank = prev.rank + (prevRankCounts - 1) + 1;
  }

  const timestamp = Date.now();
  return addDoc(collection(db, "rankings"), {
    name,
    rank,
    score,
    cursor: `${score}-${timestamp}`,
    timestamp,
  });
}

export async function getRankings({
  cursor,
  per,
}: {
  cursor: string;
  per: number;
}): Promise<Ranking[]> {
  const collref = collection(db, "rankings");
  const q = query(
    collref,
    orderBy("score", "desc"),
    limit(per),
    startAfter(cursor),
  );

  const querySnapshot = await getDocs(q);
  return mapSnapshot(querySnapshot);
}

export async function getRankingsAround({
  score,
  per,
}: {
  score: string;
  per: number;
}): Promise<Ranking[][]> {
  const collref = collection(db, "rankings");
  const beforeQuery = query(
    collref,
    orderBy("score", "desc"),
    where("score", ">=", score),
    limit(per),
  );

  const afterQuery = query(
    collref,
    orderBy("score", "desc"),
    where("score", "<=", score),
    limit(per),
  );

  return Promise.all([
    (async function () {
      return mapSnapshot(await getDocs(beforeQuery));
    })(),
    (async function () {
      return mapSnapshot(await getDocs(afterQuery));
    })(),
  ]);
}

interface Foreach {
  forEach: (callback: (doc: QueryDocumentSnapshot) => void) => void;
}

function mapSnapshot(snapshot: Foreach) {
  const list: Ranking[] = [];
  snapshot.forEach((doc) => {
    list.push(scanList(doc));
  });

  return list;
}

function scanList(doc: QueryDocumentSnapshot) {
  const data = doc.data();
  return new Ranking({
    id: doc.id,
    rank: data.rank,
    name: data.name,
    score: data.score,
    cursor: data.cursor,
    timestamp: data.timestamp,
  });
}
