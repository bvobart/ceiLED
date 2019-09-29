import { InterpolationType } from '../patterns/options/FadePatternOptions';

/**
 * Contains multiple interpolation functions, namely the Linear and Sigmoid functions.
 *
 * An interpolation function calculates by how much a pin's value should have been incremented
 * when on a certain step in the process of fading from one value to another. With a linear fade,
 * this value is incremented constantly, but with sigmoidial or polynomial functions, the incremenent
 * changes per step.
 */
export class Interpolate {
  public static for(
    type: InterpolationType,
  ): (delta: number, currentStep: number, totalSteps: number) => number {
    switch (type) {
      case InterpolationType.LINEAR:
        return Interpolate.linear;
      case InterpolationType.SIGMOID:
        return Interpolate.sigmoid;
      default:
        throw new TypeError('Invalid InterpolationType: ' + type);
    }
  }

  /**
   * Calculates the amount of delta that should be applied for a linear fade.
   * @param delta The difference in value that should be applied over the course of all steps
   * @param currentStep The current step number
   * @param totalSteps The total amount of steps that this fade takes
   */
  public static linear(delta: number, currentStep: number, totalSteps: number): number {
    return (delta * currentStep) / totalSteps;
  }

  /**
   * Calculates the amount of delta that should be applied for a sigmoidial fade.
   * Fades with sigmoid functions seem more natural to the eye.
   *
   * The fade itself occurs within the range of -8 < x < 8 on the sigmoid curve sigmoid(x).
   * @param delta The difference in value that should be applied of the course of all steps
   * @param currentStep The current step number
   * @param totalSteps The total amount of steps that this fade takes
   */
  public static sigmoid(delta: number, currentStep: number, totalSteps: number): number {
    const stepRatio = currentStep / totalSteps;
    const t = (stepRatio - 0.5) * 8; // our transition occurs between -8 and 8 on the sigmoid curve.
    return delta * (1 / (1 + Math.exp(-t)));
  }
}
