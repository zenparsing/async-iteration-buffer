# async-iteration-buffer

A buffering tool for async iteration.

```js
import { AsyncIterationBuffer } from 'async-iteration-buffer';

async function main() {
  let buffer = new AsyncIterationBuffer();

  // Insert a sequence of iteration results into the buffer
  buffer.next(1);
  buffer.next(2);
  buffer.next(3);
  buffer.return();

  // Pull the values out of the buffer by iterating over it
  for await (let value of buffer) {
    console.log(value);
  }
}
```

## Install

```sh
npm install async-iteration-buffer
```

## API

### new AsyncIterationBuffer()

Creates a new buffer instance.

### buffer.next(value)

Pushes a value into the iteration buffer.

### buffer.throw(error)

Pushes an exception into the iteration buffer.

### buffer.return(value)

Pushes a `done` result into the iteration buffer.

### AsyncIterationBuffer.of(...values)

Creates a buffer pre-filled with the specified values
