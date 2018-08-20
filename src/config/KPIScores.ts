import { intersection, divide, forEach } from "lodash";

export default {
  languages: {
    score: 25,
    // Dont use arrow function => it will loose the scope of score
    calc: function(first: string[], second: string[]): number {
      try {
        return exponentialCalculation(first, second, this.score);
      } catch (e) {
        console.log(`Error in "languages" ${e.message}`);
      }
    }
  },
  frameworks: {
    score: 30,
    calc: function(first: string[], second: string[]): number {
      try {
        return exponentialCalculation(first, second, this.score);
      } catch (e) {
        console.log(`Error in "frameworks" ${e.message}`);
      }
    }
  },
  tools: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      try {
        return normalCalculationForScore(first, second, this.score);
      } catch (e) {
        console.log(`Error in "tools" ${e.message}`);
      }
    }
  },
  misc: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      try {
        return normalCalculationForScore(first, second, this.score);
      } catch (e) {
        console.log(`Error in "misc" ${e.message}`);
      }
    }
  },
  storage: {
    score: 10,
    calc: function(first: string[], second: string[]): number {
      try {
        return normalCalculationForScore(first, second, this.score);
      } catch (e) {
        console.log(`Error in "storage" ${e.message}`);
      }
    }
  },
  modules: {
    score: 20,
    calc: function(first: string[], second: string[]): number {
      try {
        return normalCalculationForScore(first, second, this.score);
      } catch (e) {
        console.log(`Error in "modules" ${e.message}`);
      }
    }
  },
  domains: {
    score: 5,
    calc: function(first: string[], second: string[]): number {
      try {
        return normalCalculationForScore(first, second, this.score);
      } catch (e) {
        console.log(`Error in "domains" ${e.message}`);
      }
    }
  }
};

function normalCalculationForScore(
  first: string[],
  second: string[],
  maxScore: number
): number {
  const score =
    divide(intersection(first, second).length, first.length) * maxScore;
  if (isNaN(score)) {
    return 0;
  }
  return score;
}

function exponentialCalculation(
  first: string[],
  second: string[],
  maxScore: number
): number {
  second = second.filter(x => first.indexOf(x) > -1);
  const transformedFirst = mapToWeights(first);
  const transformedSecond = mapToWeights(second);

  let score = 0;

  forEach(transformedFirst, function(value, key) {
    if (!transformedSecond[key]) {
      return;
    }

    if (transformedSecond[key] < value) {
      score += transformedSecond[key];
    } else {
      score += value;
    }
  });
  return divide(score * maxScore, 100);
}

function mapToWeights(list: string[]): any {
  let mappedList = {};
  let remainingScore = 100;

  list.forEach(function(item, index) {
    const items = list.length + 1 - index;
    const res = getScore(items, remainingScore);
    remainingScore = res.remainingScore;
    mappedList[item] = res.score;
  });

  return mappedList;
}

function getScore(
  count: number,
  maxScore: number
): { remainingScore: number; score: number } {
  if (count === 1) {
    return {
      remainingScore: 0,
      score: maxScore
    };
  }
  const score = (maxScore / count) * 2;
  return {
    remainingScore: maxScore - score,
    score: score
  };
}
