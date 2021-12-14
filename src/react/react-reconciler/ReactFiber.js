import { ConcurrentRoot } from "./ReactRootTags";
import { ConcurrentMode } from "./ReactTypeOfMode";
import { HostRoot } from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";
import { NoLanes } from "./ReactFiberLane";

export function createHostRootFiber(tag) {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode;
  }
  return createFiber(HostRoot, null, null, mode);
}

function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null

  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  
  this.alternate = null
}

function createFiber(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}
