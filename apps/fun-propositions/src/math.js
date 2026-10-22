export function primeResult(n) {
  if (!Number.isInteger(n) || n < 1 || n > 60)
    throw new RangeError('n은 1~60의 정수입니다.');
  const value = n * n + n + 41;
  let factor = null;
  for (let divisor = 2; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) {
      factor = divisor;
      break;
    }
  }
  return { value, factor, prime: factor === null };
}

export function digitResult(value) {
  if (!/^\d{1,9}$/.test(value)) return null;
  const original = Number(value);
  const reversed = Number([...value].reverse().join(''));
  return {
    original,
    reversed,
    difference: original - reversed,
    quotient: (original - reversed) / 9,
  };
}
