const normalizeNullToUndefined = <T>(value: T | null): T | undefined => {
  return value === null ? undefined : value;
};

export { normalizeNullToUndefined };
