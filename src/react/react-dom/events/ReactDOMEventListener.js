import {
  DiscreteEventPriority,
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
} from "@react/react-reconciler/ReactEventPriorities";
import { IS_CAPTURE_PHASE, IS_REPLAYED } from "./EventSystemFlags";
import { hasQueuedDiscreteEvents } from "./ReactDOMEventReplaying";
import getEventTarget from "./getEventTarget";
import { getClosestInstanceFromNode } from "../client/ReactDomComponentTree";
import { getNearestMountedFiber } from "@react/react-reconciler/ReactFiberTreeReflection";
import { HostRoot } from "@react/react-reconciler/ReactWorkTags";
import { dispatchEventForPluginEventSystem } from "./DOMPluginEventSystem";

const queuedDiscreteEvents = [];

export function createEventListenerWrapperWithPriority(
  targetContainer,
  domEventName,
  eventSystemFlags
) {
  const eventPriority = getEventPriority(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEventPriority:
      listenerWrapper = dispatchDiscreteEvent;
  }
  return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer)
}

// react离散事件，待完成
function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent
) {
  const previousPriority = getCurrentUpdatePriority();
  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
  }
}

function createQueuedReplayableEvent(
  blockedOn,
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  return {
    blockedOn,
    domEventName,
    eventSystemFlags: eventSystemFlags | IS_REPLAYED,
    nativeEvent,
    targetContainer: [targetContainer],
  };
}

export function queueDiscreteEvent(
  blockedOn,
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  const queuedEvent = createQueuedReplayableEvent(
    blockedOn,
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent
  );
  queuedDiscreteEvents.push(queuedEvent);
}

export function attemptToDispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  let targetInst = getClosestInstanceFromNode(nativeEventTarget);

  if (targetInst !== null) {
    const nearestMounted = getNearestMountedFiber(targetInst);
    if (nearestMounted === null) {
      targetInst = null;
    } else {
      const tag = nearestMounted.tag;
      if (tag === HostRoot) {
        targetInst = null;
      } else if (nearestMounted !== targetInst) {
        targetInst = null;
      }
    }
  }
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  );
  return null;
}

export function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  // TODO: react派发事件，待完成
  const allowReplay = (eventSystemFlags & IS_CAPTURE_PHASE) === 0;

  if (allowReplay && hasQueuedDiscreteEvents()) {
    queueDiscreteEvent(
      null,
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent
    );
    return;
  }

  let blockedOn = attemptToDispatchEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent
  );
}

export function getEventPriority(domEventName) {
  switch (domEventName) {
    case "click":
      return DiscreteEventPriority;
  }
}
