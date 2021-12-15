let isInsideEventHandler = false;

let batchedUpdatesImpl = function (fn, bookkeeping) {
  return fn(bookkeeping);
};

function finishEventHandler() {}

export function batchedUpdates(fn, a, b) {
  if (isInsideEventHandler) {
    return fn(a, b);
  }
  isInsideEventHandler = true;
  try {
    return batchedUpdatesImpl(fn, a, b);
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
}
