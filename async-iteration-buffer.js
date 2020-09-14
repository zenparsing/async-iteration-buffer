const $asyncIterator = Symbol.asyncIterator;
const $bufferData = Symbol('bufferData');

function setBufferData(obj, data) {
  return obj[$bufferData] = data || {
    queue: [],
    requests: [],
    cancel: () => {},
  };
}

function getBufferData(obj) {
  return obj[$bufferData];
}

class BufferIterator {
  constructor(bufferData) {
    setBufferData(this, bufferData);
  }

  [$asyncIterator]() {
    return this;
  }

  next() {
    let { requests, queue } = getBufferData(this);
    try {
      if (queue.length > 0) {
        return queue.shift();
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return new Promise((resolve, reject) => {
      requests.push({ resolve, reject });
    });
  }

  return() {
    let { requests, cancel } = getBufferData(this);
    return new Promise(resolve => {
      cancel();
      while (requests.length > 0) {
        requests.shift().resolve({ value: undefined, done: true });
      }
      resolve({ value: undefined, done: true });
    });
  }
}

export class AsyncIterationBuffer {

  constructor(options = {}) {
    // It might make sense to allow the user to specify a buffering policy by
    // either allowing them to provide their own Array-like or by allowing
    // them to provide callbacks to govern buffering policy
    let buffer = setBufferData(this);
    if (options.cancel) {
      buffer.cancel = options.cancel;
    }
  }

  [$asyncIterator]() {
    return new BufferIterator(getBufferData(this));
  }

  next(value) {
    let { requests, queue } = getBufferData(this);
    let result = { value, done: false };
    if (requests.length > 0) {
      requests.shift().resolve(result);
    } else {
      queue.push(Promise.resolve(result));
    }
  }

  throw(value) {
    let { requests, queue } = getBufferData(this);
    if (requests.length > 0) {
      requests.shift().reject(value);
    } else {
      queue.push(Promise.reject(value));
    }
  }

  return(value) {
    let { requests, queue } = getBufferData(this);
    let result = { value, done: true };
    if (requests.length > 0) {
      requests.shift().resolve(result);
    } else {
      queue.push(Promise.resolve(result));
    }
  }

  static of(...args) {
    let buffer = new this();
    for (let i = 0; i < args.length; ++i) {
      buffer.next(args[i]);
    }
    return buffer;
  }

}
