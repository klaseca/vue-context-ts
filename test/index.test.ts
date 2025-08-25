import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Context } from '../src/index.ts';
import { createComponent, createComponentThree } from './testHelpers.ts';
import { h, reactive, ref, type ComponentOptions } from 'vue';

describe('Context', () => {
  describe('with default value', () => {
    const context = new Context({ key: Symbol('foo'), defaultValue: 1 });

    test('inject default value', () => {
      const wrapper = mount(createComponent(context));

      expect(wrapper.html()).toBe('<div>1</div>');
    });

    test('inject provided value', () => {
      const wrapper = mount(createComponentThree(context, 2));

      expect(wrapper.html()).toBe('<div>2</div>');
    });
  });

  describe('with default value (nullish allowed)', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: ref(1),
      isNullishAllowed: true,
    });

    test('inject without provided value', () => {
      const wrapper = mount(createComponent(context));

      expect(wrapper.html()).toBe('<div>1</div>');
    });

    test('inject provided value', () => {
      const wrapper = mount(createComponentThree(context, undefined));

      expect(wrapper.html()).toBe('<div></div>');
    });
  });

  describe('without default value', () => {
    const context = new Context({
      key: Symbol('foo'),
      defaultValue: Context.valueType<string>(),
    });

    test('inject without provided value', () => {
      expect(() => mount(createComponent(context, true))).toThrowError();
    });

    test('inject provided value', () => {
      const wrapper = mount(createComponentThree(context, 'data'));

      expect(wrapper.html()).toBe('<div>data</div>');
    });
  });

  describe('without default value (nullish allowed)', () => {
    const context = new Context({
      key: Symbol('foo'),
      defaultValue: Context.valueType<bigint>(),
      isNullishAllowed: true,
    });

    test('inject without provided value', () => {
      const wrapper = mount(createComponent(context));

      expect(wrapper.html()).toBe('<div></div>');
    });

    test('inject provided value', () => {
      const wrapper = mount(createComponentThree(context, 10n));

      expect(wrapper.html()).toBe('<div>10</div>');
    });
  });

  test('override provided value', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: reactive({ foo: 'foo' }),
    });

    const Consumer: ComponentOptions = {
      setup() {
        const value = context.inject();
        return () => h('div', value.foo);
      },
    };

    const Provider: ComponentOptions = {
      setup() {
        context.provide(reactive({ foo: 'bar' }));
        return () => h(Consumer);
      },
    };

    const wrapper = mount(Provider);

    expect(wrapper.html()).toBe('<div>bar</div>');
  });

  test('override default value by undefined', () => {
    const context = new Context({
      key: 'foo',
      defaultValue: reactive({ foo: 'foo' }),
      isNullishAllowed: true,
    });

    const Consumer: ComponentOptions = {
      setup() {
        const value = context.inject();
        return () => h('div', value);
      },
    };

    const Provider: ComponentOptions = {
      setup() {
        context.provide(undefined);
        return () => h(Consumer);
      },
    };

    const wrapper = mount(Provider);

    expect(wrapper.html()).toBe('<div></div>');
  });

  test('default value as factory', () => {
    const context = new Context({
      key: Symbol('foo'),
      defaultValue: () => 'factory',
      isDefaultAsFactory: true,
    });

    const wrapper = mount(createComponent(context));

    expect(wrapper.html()).toBe('<div>factory</div>');
  });
});
