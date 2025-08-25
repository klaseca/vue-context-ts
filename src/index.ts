import { inject, provide, type InjectionKey } from 'vue';

export type Nullish<T> = T | undefined | null;

export type ContextKey<Value> = InjectionKey<Value> | string;

export type ValueFromFactory<
  Value,
  AsFactory extends boolean,
> = AsFactory extends true ? (Value extends () => infer U ? U : never) : Value;

export type ValueType<
  Value,
  NullishAllowed extends boolean,
  AsFactory extends boolean,
> = NullishAllowed extends true
  ? Nullish<ValueFromFactory<Value, AsFactory>>
  : NonNullable<ValueFromFactory<Value, AsFactory>>;

export type DefaultValue<
  Value,
  AsFactory extends boolean,
> = AsFactory extends false
  ? Nullish<Value>
  : () => Value extends () => infer U ? U : never;

export interface ContextOptions<
  Value,
  NullishAllowed extends boolean,
  AsFactory extends boolean,
> {
  key: ContextKey<ValueType<Value, NullishAllowed, AsFactory>>;
  defaultValue: DefaultValue<Value, AsFactory>;
  isNullishAllowed?: NullishAllowed;
  isDefaultAsFactory?: AsFactory;
}

export class Context<
  Value,
  NullishAllowed extends boolean = false,
  AsFactory extends boolean = false,
> {
  private readonly key: ContextKey<ValueType<Value, NullishAllowed, AsFactory>>;

  private readonly defaultValue: DefaultValue<Value, AsFactory>;

  private readonly isNullishAllowed: NullishAllowed;

  private readonly isDefaultAsFactory: AsFactory;

  constructor({
    key,
    defaultValue,
    isNullishAllowed = false as NullishAllowed,
    isDefaultAsFactory = false as AsFactory,
  }: ContextOptions<Value, NullishAllowed, AsFactory>) {
    this.key = key;
    this.defaultValue = defaultValue;
    this.isNullishAllowed = isNullishAllowed;
    this.isDefaultAsFactory = isDefaultAsFactory;
  }

  inject(): ValueType<Value, NullishAllowed, AsFactory> {
    const value = inject<unknown>(
      this.key,
      this.defaultValue,
      this.isDefaultAsFactory as any,
    );

    if (!this.isNullishAllowed && value == null) {
      throw new Error(`No value provided for key: "${String(this.key)}"`);
    }

    return value as ValueType<Value, NullishAllowed, AsFactory>;
  }

  provide(value: ValueType<Value, NullishAllowed, AsFactory>): void {
    provide(this.key, value);
  }

  static valueType<T extends {}>(): Nullish<T> {
    return undefined;
  }
}
