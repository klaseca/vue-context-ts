import { describe, test, expectTypeOf } from 'vitest';
import { Context } from '../src/index.ts';

describe('Context', () => {
  describe('with default value', () => {
    const context = new Context({ key: 'foo', defaultValue: 1 });

    test('instance', () => {
      expectTypeOf(context).toEqualTypeOf<Context<number, false>>();
    });

    test('provide', () => {
      expectTypeOf(context.provide).toEqualTypeOf<(value: number) => void>();
    });

    test('inject', () => {
      expectTypeOf(context.inject).toEqualTypeOf<() => number>();
    });
  });

  describe('with default value (nullish allowed)', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: 1,
      isNullishAllowed: true,
    });

    test('instance', () => {
      expectTypeOf(context).toEqualTypeOf<Context<number, true>>();
    });

    test('provide', () => {
      expectTypeOf(context.provide).toEqualTypeOf<
        (value: number | undefined | null) => void
      >();
    });

    test('inject', () => {
      expectTypeOf(context.inject).toEqualTypeOf<
        () => number | undefined | null
      >();
    });
  });

  describe('without default value', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: Context.valueType<string>(),
    });

    test('instance', () => {
      expectTypeOf(context).toEqualTypeOf<Context<string, false>>();
    });

    test('provide', () => {
      expectTypeOf(context.provide).toEqualTypeOf<(value: string) => void>();
    });

    test('inject', () => {
      expectTypeOf(context.inject).toEqualTypeOf<() => string>();
    });
  });

  describe('without default value (nullish allowed)', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: Context.valueType<string>(),
      isNullishAllowed: true,
    });

    test('instance', () => {
      expectTypeOf(context).toEqualTypeOf<Context<string, true>>();
    });

    test('provide', () => {
      expectTypeOf(context.provide).toEqualTypeOf<
        (value: string | undefined | null) => void
      >();
    });

    test('inject', () => {
      expectTypeOf(context.inject).toEqualTypeOf<
        () => string | undefined | null
      >();
    });
  });

  describe('with value as factory', () => {
    const context = new Context({
      key: Symbol('foo'),
      defaultValue: () => [1, 2],
      isDefaultAsFactory: true,
    });

    test('instance', () => {
      expectTypeOf(context).toEqualTypeOf<
        Context<() => number[], false, true>
      >();
    });

    test('provide', () => {
      expectTypeOf(context.provide).toEqualTypeOf<(value: number[]) => void>();
    });

    test('inject', () => {
      expectTypeOf(context.inject).toEqualTypeOf<() => number[]>();
    });

    test('allow only fn', () => {
      new Context({
        key: Symbol('foo'),
        // @ts-expect-error need factory fn
        defaultValue: 1,
        isDefaultAsFactory: true,
      });
    });
  });
});
