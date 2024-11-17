import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  Query,
} from "@firebase/firestore";
import { db } from "@/services/firebase";
import { Ranking } from "../../models/ranking";
import { ResultParams } from "../../models/result";

const namespaces = {
  rankings: "rankings",
  results: "results",
};

export async function addRanking({
  name,
  score,
  time,
  setting,
  rank,
  timestamp,
}: {
  name: string;
  time: number;
  setting: SettingParams;
  score: number;
  rank: number;
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
  const prev = querySnapshot.docs?.[0]?.data();
  if (prev?.score === score) {
    return addDocToRanking(prev.id, { name, time, setting, timestamp });
  }

  const doc = await addDoc(collection(db, "rankings"), {
    rank,
    score,
    cursor: `${score}-${timestamp}`,
    timestamp,
  });

  return addDocToRanking(doc.id, { name, time, setting, timestamp });
}

type SettingParams = {
  minDistance: number;
  popRate: number;
  speed: number;
};

function addDocToRanking(
  id: string,
  {
    name,
    time,
    setting,
    timestamp,
  }: { name: string; time: number; setting: SettingParams; timestamp: number },
) {
  return addDoc(collection(db, namespaces.rankings, id, namespaces.results), {
    name,
    time,
    setting,
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
  return mapSnapshot(querySnapshot, per);
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
  const take = per * bufferMultipler;
  const beforeQuery = query(
    collref,
    orderBy("score", "asc"),
    where("score", ">=", score),
    limit(take),
  );

  const afterQuery = query(
    collref,
    orderBy("score", "desc"),
    where("score", "<=", score),
    limit(take),
  );

  return Promise.all([
    mapSnapshot(await getDocs(beforeQuery), take),
    mapSnapshot(await getDocs(afterQuery), take),
  ]);
}

interface Foreach {
  forEach: (callback: (doc: QueryDocumentSnapshot) => void) => void;
}

function mapSnapshot(snapshot: Foreach, perForSubDocs: number) {
  const res: Promise<Ranking>[] = [];
  snapshot.forEach((doc) => {
    const subRef = collection(
      db,
      namespaces.rankings,
      doc.id,
      namespaces.results,
    );
    const subQuery = query(
      subRef,
      orderBy("timestamp", "desc"),
      limit(perForSubDocs),
    );
    res.push(scanList(doc, subQuery));
  });
  return Promise.all(res);
}

async function scanList(doc: QueryDocumentSnapshot, subQuery: Query) {
  const data = doc.data();

  const subSnapshot = await getDocs(subQuery);
  const results: ResultParams[] = [];
  subSnapshot.forEach((subDoc: QueryDocumentSnapshot) => {
    const { name, time, setting, timestamp } = subDoc.data();
    results.push({ id: subDoc.id, name, time, setting, timestamp });
  });

  return new Ranking({
    id: doc.id,
    rank: data.rank,
    score: data.score,
    cursor: data.cursor,
    count: results.length,
    results,
    timestamp: data.timestamp,
  });
}

export function listenRankings(cb: (data: Ranking[]) => void, { per = 10 }) {
  const collref = collection(db, namespaces.rankings);
  const q = query(collref, orderBy("score", "desc"), limit(per));
  return onSnapshot(q, async (doc) => {
    const list = await mapSnapshot(doc.docs, per);
    cb(list);
  });
}
