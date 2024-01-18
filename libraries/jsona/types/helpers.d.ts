type NonNeverAndUndefined<T> = T extends never | undefined ? never : T;

type FilterTuple<T extends any[]> = T extends [infer F, ...infer R] ? [NonNeverAndUndefined<F>, ...FilterTuple<R>] : [];

// Optional: Flatten the type to remove 'never' from the tuple
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends never
    ? Flatten<R>
    : [F, ...Flatten<R>]
  : [];

type CleanedTuple<T extends any[]> = Flatten<FilterTuple<T>>;

// Helper type to convert union to intersection
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Helper type to convert union to tuple
export type UnionToTuple<U> = UnionToIntersection<U extends any ? () => U : never> extends () => infer W
  ? [...CleanedTuple<UnionToTuple<Exclude<U, W>>>, W]
  : [];

export type TupleOfKeys<T> = UnionToTuple<keyof T>;
