
export type ResultParams = {
  name: string;
  timestamp: number;
}

export class Result {
  private _raw: ResultParams;

  constructor(params: ResultParams) {
    this._raw = params;
  }

  get clone() {
    return new Result(this._raw);
  }

  setName(name: string) {
    const cloned = this.clone;
    cloned._raw.name = name;
    return cloned;
  }
}
