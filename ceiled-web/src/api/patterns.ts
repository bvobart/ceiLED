import { Pattern, PatternType } from "../components/animations";

export const isPattern = (x: any): x is Pattern => {
  return Object.values(PatternType).includes(x.type) && typeof x.length === 'number';
};

export const isPatternArray = (x: any): x is Pattern[] => {
  if (Array.isArray(x)) {
    return !x.some(p => !isPattern(p));
  }
  return false;
};
