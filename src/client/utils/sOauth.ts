const makeId = (length: number): string => {
  let res = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charL = chars.length;
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * charL));
  }
  return res;
};

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { makeId, getRandomInt };
