# vue-context-ts

[![NPM Version](https://img.shields.io/npm/v/vue-context-ts?label=vue-context-ts)](https://www.npmjs.com/package/vue-context-ts)

Type-safe wrapper around default vue provide/inject functions

## Installation

```sh
npm i vue-context-ts
```

## API

```typescript
const context = new Context(options);
```

### options

| Property           | Default value | Description                                      |
| ------------------ | ------------- | ------------------------------------------------ |
| key                | -             | key for default provide/inject functions         |
| defaultValue       | -             | Default value of your context                    |
| isNullishAllowed   | false         | Allows `nullish` values in context               |
| isDefaultAsFactory | false         | Allows using a factory function as default value |

## Usage

### Create context with defined `defaultValue`

```typescript
const context = new Context({ key: Symbol('key'), defaultValue: 1 });
```

### Create context without defined `defaultValue`

If you do not want to pass `defaultValue` when creating a context, use static method `valueType` from `Context` to specify type of value you expect

```typescript
const context = new Context({
  key: Symbol('key'),
  defaultValue: Context.valueType<string>(),
});

// Provide a value from a vue component

context.provide('random string');
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  `provide` expects a value of type `string` (as specified in `Context.valueType`)
*/

// Inject a value into a vue component

const value = context.inject();
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  `value` is of type `string` (as specified in `Context.valueType`)
  If `context.inject` is used without `context.provide`, an error will be thrown
*/
```

If `undefined` or `null` value should be allowed, set `isNullishAllowed` option to `true`

```typescript
const context = new Context({
  key: 'key',
  defaultValue: 'random string',
  isNullishAllowed: true,
});

// Provide a value from a vue component

context.provide(null);
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  `provide` expects a value of type `string` (inferred from default value) or `null` or `undefined` (because `isNullishAllowed` is `true`)
*/

// Inject a value into a vue component

const value = context.inject();
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  `value` is of type `string` (inferred from default value) or `null` or `undefined` (because `isNullishAllowed` is `true`)
*/
```

You can also use factory function as default value

```typescript
const context = new Context({
  key: 'key',
  defaultValue: () => 1,
  isDefaultAsFactory: true,
});

// Inject a value into a vue component

const value = context.inject();
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  `value` is of type `number` (inferred from return value of factory function)
*/
```
