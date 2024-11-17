import { Ranking } from "./ranking";

type Setting = {
  minDistance: number;
  popRate: number;
  speed: number;
};

export type ResultParams = {
  id: string;
  name: string;
  time: number;
  setting: Setting;
  timestamp: number;
};

export class Result {
  private _raw: ResultParams;
  private _parent: Ranking | null = null;

  constructor(params: ResultParams) {
    this._raw = params;
  }

  get clone() {
    const cloned = new Result(this._raw);
    if (this.parent) {
      return cloned.setParent(this.parent);
    }
    return cloned;
  }

  get parent() {
    return this._parent;
  }

  get id() {
    return this._raw.id;
  }

  get name() {
    return this._raw.name;
  }

  get time() {
    return this._raw.time;
  }

  get setting() {
    return this._raw.setting;
  }

  get timestamp() {
    return this._raw.timestamp;
  }

  get rank() {
    return this.parent?.rank;
  }

  get score() {
    return this.parent?.score;
  }

  setName(name: string) {
    const cloned = this.clone;
    cloned._raw.name = name;
    return cloned;
  }

  setParent(parent: Ranking): Result {
    const cloned = this.clone;
    cloned._parent = parent;
    return cloned;
  }

  incrementRank() {
    if (!this.parent) {
      return this;
    }
    const cloned = this.clone;
    return cloned.setParent(cloned.parent!.incrementRank());
  }
}
