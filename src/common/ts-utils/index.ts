export type CommonKeys<T extends object, U extends object> = Extract<
  keyof T,
  keyof U
>;
