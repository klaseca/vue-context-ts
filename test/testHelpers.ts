import { h, toValue, type ComponentOptions } from 'vue';
import type { Context, ValueType } from '../src/index.ts';

export const createComponent = (
  context: Context<any, any, any>,
  isEmptyRender = false,
): ComponentOptions => ({
  setup() {
    const value = context.inject();
    return () => h('div', toValue(value ?? undefined));
  },
  // Prevent "Component is missing template or render function" warn if `context.inject` throw error
  ...(isEmptyRender && { render: () => h('div') }),
});

export const createComponentThree = <T, N extends boolean>(
  context: Context<T, N>,
  providedValue: NoInfer<ValueType<T, N, any>>,
): ComponentOptions => {
  const Consumer: ComponentOptions = {
    setup() {
      const value = context.inject();
      return () => h('div', toValue(value ?? undefined));
    },
  };

  const Middle: ComponentOptions = {
    render: () => h(Consumer),
  };

  const Provider: ComponentOptions = {
    setup() {
      context.provide(providedValue);
      return () => h(Middle);
    },
  };

  return Provider;
};
