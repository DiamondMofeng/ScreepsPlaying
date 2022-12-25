export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
}

export type ArrayType<T> = T extends (infer U)[] ? U : never;

// type NotA<T, R> = T extends R ? never : T

// type NotB<T, R> = R extends T ? never : T
// type OmitString<T, U> = NotA<T, U> & NotB<T, U>
