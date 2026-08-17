/** Recursively preserves dictionary keys while allowing translated string values. */
export type TranslationShape<T> =
  T extends string ? string
    : T extends readonly (infer Item)[] ? TranslationShape<Item>[]
      : T extends object ? { [Key in keyof T]: TranslationShape<T[Key]> }
        : T;

export type FeatureDictionary<Shape> = {
  bn: Shape;
  en: TranslationShape<Shape>;
};
