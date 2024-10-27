import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  writeBatch,
} from "@firebase/firestore";
import { db } from "@/services/firebase";

export async function batchUpdateRanking(
  rank: number,
  namespace: string,
  batchSize: number = 300,
) {
  const collref = collection(db, namespace);
  const q = query(
    collref,
    orderBy("rank", "asc"),
    where("rank", ">=", rank),
    limit(batchSize),
  );
  const querySnapshot = await getDocs(q);
  let docs = querySnapshot.docs;
  while (docs.length > 0) {
    const batch = writeBatch(db);
    docs.forEach((doc) => {
      batch.update(doc.ref, { rank: doc.data().rank + 1 });
    });
    batch.commit();

    const last = docs[docs.length - 1].data();

    const q = query(
      collref,
      orderBy("rank", "asc"),
      where("rank", ">", last.rank),
      limit(300),
    );
    const querySnapshot = await getDocs(q);
    docs = querySnapshot.docs;
  }
}
