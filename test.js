import { AsyncIterationBuffer } from './async-iteration-buffer.js';
import * as assert from 'assert';

async function main() {
  {
    let buffer = new AsyncIterationBuffer();
    buffer.next(1);
    buffer.next(2);
    buffer.next(3);
    buffer.return();

    let iter = buffer[Symbol.asyncIterator]();

    assert.deepEqual(await iter.next(), { value: 1, done: false });
    assert.deepEqual(await iter.next(), { value: 2, done: false });
    assert.deepEqual(await iter.next(), { value: 3, done: false });
    assert.deepEqual(await iter.next(), { value: undefined, done: true });
  }

  {
    let buffer = AsyncIterationBuffer.of(1, 2, 3, 4);

    let iter = buffer[Symbol.asyncIterator]();

    assert.deepEqual(await iter.next(), { value: 1, done: false });
    assert.deepEqual(await iter.next(), { value: 2, done: false });
    assert.deepEqual(await iter.next(), { value: 3, done: false });
    assert.deepEqual(await iter.next(), { value: 4, done: false });
  }
}

main();
