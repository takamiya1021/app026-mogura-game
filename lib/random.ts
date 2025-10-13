export const randomBetween = (min: number, max: number): number => {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const pickNextDistinctIndex = (
  size: number,
  previous: number | null,
): number => {
  if (size <= 1) {
    return 0;
  }

  const candidate = Math.floor(Math.random() * size);

  if (previous === null || candidate !== previous) {
    return candidate;
  }

  // Shift by a random offset to keep distribution even while avoiding repeats.
  const offset = Math.floor(Math.random() * (size - 1)) + 1;
  return (candidate + offset) % size;
};

