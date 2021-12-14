import { NoLane, NoLanes, createLaneMap, NoTimestamp } from "./ReactFiberLane";
import { createHostRootFiber } from "./ReactFiber";
import { initializeUpdateQueue } from "./ReactUpdateQueue";

function FiberRoot(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.finishedWork = null;
  this.context = null;
  this.pendingContext = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);
}

export function createFiberRoot(containerInfo, tag) {
  const root = new FiberRoot(containerInfo, tag);

  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;

  const initialState = {
    element: null,
  };
  uninitializedFiber.memoizedState = initialState;
  initializeUpdateQueue(uninitializedFiber);
  return root;
}
