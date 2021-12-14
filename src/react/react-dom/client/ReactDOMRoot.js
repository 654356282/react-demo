import { createContainer } from "@react/react-reconciler/ReactFiberReconciler";
import { ConcurrentRoot } from "@react/react-reconciler/ReactRootTags";
import { markContainerAsRoot } from "./ReactDomComponentTree";
import { listernToAllSupportedEvents } from "../events/DOMPluginEventSystem";

export function createRoot(container) {
  const root = createContainer(container, ConcurrentRoot);
  markContainerAsRoot(root.current, container);

  const rootContainer = container;
  listernToAllSupportedEvents(rootContainer);
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {};
