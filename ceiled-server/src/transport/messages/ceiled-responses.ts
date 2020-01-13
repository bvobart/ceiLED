import { Pattern } from '../../patterns/Pattern';

/* tslint:disable:max-classes-per-file */

export interface PatternResponse {
  channel: number | 'all';
  pattern: Pattern;
}

export interface PatternsResponse {
  patterns: Map<number, Pattern>;
}

export interface AnimationsResponse {
  animations: Map<number, Pattern[]>;
}
