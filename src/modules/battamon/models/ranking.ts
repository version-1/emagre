import { Result, ResultParams } from "./result";

export type RankingParams = {
  id?: string;
  score: number;
  count: number;
  rank?: number;
  results?: ResultParams[];
  cursor?: string;
  timestamp?: number;
};

export class Ranking {
  private _raw: RankingParams;
  private _results: Result[] = [];

  constructor(params: RankingParams) {
    this._raw = params;

    if (params.results) {
      this._results = params.results.map((p) => {
        const result = new Result(p);
        return result.setParent(this);
      });
    }
  }

  get clone() {
    return new Ranking(this._raw);
  }

  get id() {
    return this._raw.id;
  }

  get rank() {
    return this._raw.rank;
  }

  get nextRank() {
    return this._raw.rank ? this._raw.rank + this._raw.count : 1;
  }

  get score() {
    return this._raw.score;
  }

  get timestamp() {
    return this._raw.timestamp;
  }

  get count() {
    return this._raw.count;
  }

  get results() {
    return this._results;
  }

  buildResult(params: Partial<ResultParams>) {
    const result = new Result(params);
    return result.setParent(this);
  }

  setRank(rank: number) {
    const cloned = this.clone;
    cloned._raw.rank = rank;
    return cloned;
  }

  incrementRank() {
    const rank = this._raw.rank || 1;
    return this.setRank(rank + 1);
  }
}

export function flattenResults(rankings: Ranking[]) {
  return rankings.reduce((acc, r) => [...acc, ...r.results], [] as Result[]);
}

export const resolveRankings = (
  before: Ranking[],
  after: Ranking[],
  target: Result,
  beforeAfterLength = 3,
): Result[] => {
  const desiredLength = beforeAfterLength * 2 + 1;

  const beforeList = flattenResults(before);
  const afterList = flattenResults(after);

  let list = [target];
  const t1 = [...beforeList];
  t1.some(() => {
    const e = beforeList.shift()!;
    list.unshift(e);

    if (list.length >= beforeAfterLength + 1) {
      return true;
    }
  });

  const t2 = [...afterList];
  t2.some(() => {
    const e = afterList.shift()!;
    list.push(e.incrementRank());
    if (list.length >= desiredLength) {
      return true;
    }
  });

  if (list.length >= desiredLength) {
    return list;
  }

  const t3 = [...beforeList];
  t3.some((_) => {
    const e = beforeList.shift();
    list.unshift(e!);
    if (list.length >= desiredLength) {
      return true;
    }
  });

  return list;
};
