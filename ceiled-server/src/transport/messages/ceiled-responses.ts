import { IPattern } from '../../patterns/Pattern';

/* tslint:disable:max-classes-per-file */

export interface PatternResponse {
  channel: number | 'all';
  pattern: IPattern;
}

export interface PatternsResponse {
  patterns: Map<number, IPattern>;
}

export interface AnimationsResponse {
  animations: Map<number, IPattern[]>;
}
