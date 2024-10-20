export const cls = (obj: Record<string, boolean>) => {
  return Object.keys(obj)
    .filter((key) => {
      return obj[key];
    })
    .join(" ");
};

export const join = (...args: string[]) => {
  return args.join(" ");
};
