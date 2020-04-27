import { IPattern } from '../../patterns/Pattern';

/* tslint:disable:max-classes-per-file */

export interface PatternResponse {
  channel: number;
  pattern: IPattern | undefined;
}

export interface PatternsResponse {
  patterns: Array<[number, IPattern]>;
}

export interface AnimationsResponse {
  animations: Array<[number, IPattern[]]>;
}
