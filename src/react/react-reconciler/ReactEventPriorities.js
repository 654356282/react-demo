import { NoLane, SyncLane } from "./ReactFiberLane";

let currentUpdatePriority = NoLane;

export const DiscreteEventPriority = SyncLane;

export function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}

export function setCurrentUpdatePriority(newPriority) {
    currentUpdatePriority = newPriority
}