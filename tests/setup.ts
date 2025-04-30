/* eslint-disable import/newline-after-import,import/first */
// 添加 jest 全局对象模拟来解决 jest-canvas-mock 的兼容性问题
import { vi, expect } from 'vitest';

// 模拟全局 jest 对象
global.jest = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  mock: vi.mock,
  doMock: vi.doMock,
  unmock: vi.unmock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  mocked: vi.mocked,
  hoisted: vi.hoisted,
  expect
};

import '@testing-library/jest-dom';
import { theme } from 'antd';
// mock indexedDB to test with dexie
// refs: https://github.com/dumbmatter/fakeIndexedDB#dexie-and-other-indexeddb-api-wrappers
import 'fake-indexeddb/auto';
import React from 'react';

// only inject in the dom environment
if (
  // not node runtime
  typeof window !== 'undefined' &&
  // not edge runtime
  typeof (globalThis as any).EdgeRuntime !== 'string'
) {
  // test with canvas
  await import('vitest-canvas-mock');
}

// node runtime
if (typeof window === 'undefined') {
  // test with polyfill crypto
  const { Crypto } = await import('@peculiar/webcrypto');

  Object.defineProperty(global, 'crypto', {
    value: new Crypto(),
    writable: true,
  });
}

// remove antd hash on test
theme.defaultConfig.hashed = false;

// 将 React 设置为全局变量，这样就不需要在每个测试文件中导入它了
(global as any).React = React;
