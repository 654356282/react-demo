import { NoFlags, Placement } from "./ReactFiberFlags";
import { HostRoot } from "./ReactWorkTags";

// 找到最近有Placement的结点，或者hostRoot结点
export function getNearestMountedFiber(fiber) {
  let node = fiber;
  let nearestMounted = fiber;
  if (!fiber.alternate) {
    let nextNode = node;
    do {
      node = nextNode;
      if ((node.flags & Placement) !== NoFlags) {
        nearestMounted = node.return;
      }
      nextNode = node.return
    } while (nextNode);
  } else {
    while (node.return) {
      node = node.return;
    }
  }

  if (node.tag === HostRoot) {
    return nearestMounted;
  }
  return null;
}
