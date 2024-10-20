type RankingParams = {
  id: string;
  name: string;
  score: number;
  rank: number;
  cursor: string;
  timestamp: number;
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
}
