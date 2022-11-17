import { getDateDiff } from './getDateDiff';

export const countTotal = (amounts) => {
  return amounts.reduce((acc, i) => {
    // const diff = getDateDiff(i.date);
    // const percent = i.amount / 100;
    // const sum = diff > 0 ? i.amount + diff * percent : i.amount;
    return acc + i.amount;
  }, 0);
};
