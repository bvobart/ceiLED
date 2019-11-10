import Color from './Color';

export enum TransitionType {
  NONE = 'none',
  FADE_LINEAR = 'fade-linear',
  FADE_SIGMOID = 'fade-sigmoid',
}

export interface Transition {
  from: Color;
  to: Color;
  type: TransitionType;
}
