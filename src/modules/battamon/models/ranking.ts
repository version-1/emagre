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
}

