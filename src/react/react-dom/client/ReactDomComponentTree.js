const randomKey = Math.random().toString(36).slice(2);
const internalContainerInstanceKey = "__reactContainer$" + randomKey;
const internalInstanceKey = "__reactFiber$" + randomKey;
const internalPropsKey = "__reactProps$" + randomKey;

export function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}

// 找到最近的fiber结点(如果自身已经挂载，那就是自己)
export function getClosestInstanceFromNode(targetNode) {
  let targetInst = targetNode[internalInstanceKey];
  if (targetInst) {
    return targetInst;
  }

  let parentNode = targetNode.parentNode;
  while (parentNode) {
    targetInst =
      parentNode[internalContainerInstanceKey] ||
      parentNode[internalInstanceKey];
    if (targetInst) {
      return targetInst;
    }

    targetNode = parentNode;
    parentNode = targetNode.parentNode;
  }
  return null;
}

export function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null;
}
