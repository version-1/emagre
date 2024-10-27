import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { db } from "@/services/firebase";
import { Ranking } from "../../models/ranking";

const namespaces = {
  rankings: "rankings",
  results: "results",
};

export async function addRanking({
  name,
  score,
  timestamp,
}: {
  name: string;
  score: number;
  timestamp: number;
}) {
  const collref = collection(db, namespaces.rankings);
  const q = query(
    collref,
    orderBy("score", "desc"),
    where("score", ">=", score),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  let rank = 1;
  const prev = querySnapshot.docs?.[0]?.data();
  if (prev?.score === score) {
    return addDocToRanking(prev.id, { name, timestamp });
  }

  const prevRank = prev?.score || 0;
  const doc = await addDoc(collection(db, "rankings"), {
    rank,
    score: prevRank + 1,
    cursor: `${score}-${timestamp}`,
    timestamp,
  });

  return addDocToRanking(doc.id, { name, timestamp });
}

function addDocToRanking(
  id: string,
  { name, timestamp }: { name: string; timestamp: number },
) {
  return addDoc(collection(db, namespaces.rankings, id, namespaces.results), {
    name,
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
  score: number;
  per: number;
}): Promise<Ranking[][]> {
  const collref = collection(db, "rankings");
  const bufferMultipler = 2;
  const beforeQuery = query(
    collref,
    orderBy("score", "asc"),
    where("score", ">=", score),
    limit(per * bufferMultipler),
  );

  const afterQuery = query(
    collref,
    orderBy("score", "desc"),
    where("score", "<=", score),
    limit(per * bufferMultipler),
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
    score: data.score,
    cursor: data.cursor,
    timestamp: data.timestamp,
  });
}
