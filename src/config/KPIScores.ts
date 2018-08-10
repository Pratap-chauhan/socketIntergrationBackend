import { intersection, divide } from "lodash";

export default {
  languages: {
    score: 25,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  frameworks: {
    score: 30,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  tools: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  misc: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  storage: {
    score: 10,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  modules: {
    score: 20,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  },
  domains: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      return normalCalculationForScore(first, second, this.score);
    }
  }
};

function normalCalculationForScore(
  first: string[],
  second: string[],
  maxScore: number
): number {
  return divide(intersection(first, second).length, first.length) * maxScore;
}
