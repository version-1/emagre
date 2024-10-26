export type RankingParams = {
  id?: string;
  name: string;
  score: number;
  rank?: number;
  cursor?: string;
  timestamp?: number;
};

export class Ranking {
  private _raw: RankingParams;

  constructor(params: RankingParams) {
    this._raw = params;
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

  get name() {
    return this._raw.name;
  }

  get score() {
    return this._raw.score;
  }

  setName(name: string) {
    const cloned = this.clone;
    cloned._raw.name = name;
    return cloned;
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

export const resolveRankings = (
  before: Ranking[],
  after: Ranking[],
  target: Ranking,
  beforeAfterLength = 3,
): Ranking[] => {
  const desiredLength = beforeAfterLength * 2 + 1;

  const list = [target];
  let targetList = [...before];
  targetList.forEach(() => {
    const e = before.shift();
    list.unshift(e!);
    if (list.length >= beforeAfterLength + 1) {
      return;
    }
  });

  targetList = [...after];
  targetList.forEach(() => {
    const e = after.shift();
    list.push(e!.incrementRank());
    if (list.length >= desiredLength) {
      return;
    }
  });

  if (list.length >= desiredLength) {
    return list;
  }

  targetList = [...before];
  targetList.forEach((_) => {
    const e = before.shift();
    list.unshift(e!);
    if (list.length >= desiredLength) {
      return;
    }
  });

  return list;
};
