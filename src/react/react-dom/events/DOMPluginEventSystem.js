import {
  HostComponent,
  HostPortal,
  HostRoot,
} from "@react/react-reconciler/ReactWorkTags";
import { batchedUpdates } from "./ReactDOMUpdateBatching";
import { allNativeEvents } from "./EventRegistry";
import {
  IS_CAPTURE_PHASE,
  IS_EVENT_HANDLE_NON_MANAGED_NODE,
  IS_NON_DELEGATED,
} from "./EventSystemFlags";
import * as SimpleEventPlugin from "./plugins/SimpleEventPlugin";
import { createEventListenerWrapperWithPriority } from "./ReactDOMEventListener";
import getEventTarget from "./getEventTarget";
import {
  addEventBubbleListener,
  addEventCaptureListener,
} from "./EventListener";
import getListener from "./getListener";

const listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);

export function listenToNativeEvent(
  domEventName,
  isCapturePhaseListener,
  target
) {
  let eventSystemFlags = 0;
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }
  addTrappedEventListener(
    target,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener
  );
}

function addTrappedEventListener(
  targetContainer,
  domEventName,
  eventSystemFlags,
  isCapturePhaseListener
) {
  let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags
  );
  let unsubscribeListener;
  if (isCapturePhaseListener) {
    unsubscribeListener = addEventCaptureListener(
      targetContainer,
      domEventName,
      listener
    );
  } else {
    unsubscribeListener = addEventBubbleListener(
      targetContainer,
      domEventName,
      listener
    );
  }
}

export function listernToAllSupportedEvents(rootContainerElement) {
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
  }
  allNativeEvents.forEach((domEventName) => {
    listenToNativeEvent(domEventName, false, rootContainerElement);
    listenToNativeEvent(domEventName, true, rootContainerElement);
  });
}

function isMatchingRootContainer(grandContainer, targetContainer) {
  return grandContainer === targetContainer || grandContainer.nodeType;
}

export function dispatchEventForPluginEventSystem(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  let ancestorInst = targetInst;
  if (
    (eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 &&
    (eventSystemFlags & IS_NON_DELEGATED) === 0
  ) {
    const targetContainerNode = targetContainer;

    if (targetInst !== null) {
      let node = targetInst;

      mainLoop: while (true) {
        if (node === null) return;

        const nodeTag = node.tag;
        if (nodeTag === HostRoot || nodeTag === HostPortal) {
          let container = node.stateNode.containerInfo;
          if (isMatchingRootContainer(container, targetContainerNode)) {
            break;
          }
        }
        node = node.return;
      }
    }
  }

  batchedUpdates(() => {
    dispatchEventsForPlugins(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      ancestorInst,
      targetContainer
    );
  });
}

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
}

function dispatchEventsForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue = [];
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
  processDispatchQueue(dispatchQueue, eventSystemFlags)
}

function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {

}

export function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0
  for(let i = 0; i < dispatchQueue.length; i++) {
    const {event, listeners} = dispatchQueue[i]

  }
}

export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativeEventType,
  inCapturePhase,
  accmulateTargetOnly,
  nativeEvent
) {
  const captureName = reactName !== null ? reactName + "Capture" : null;
  const reactEventName = inCapturePhase ? captureName : reactName;
  let listeners = [];

  let instance = targetFiber;
  let lastHostComponent = null;
  while (instance !== null) {
    const { stateNode, tag } = instance;

    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;

      if (reactEventName !== null) {
        const listener = getListener(instance, reactEventName);
        if (listener != null) {
          listeners.push(
            createDispatchListener(instance, listener, lastHostComponent)
          );
        }
      }
    }

    if (accmulateTargetOnly) {
      break;
    }

    instance = instance.return;
  }
  return listeners;
}

function createDispatchListener(
  instance: null | Fiber,
  listener: Function,
  currentTarget: EventTarget
): DispatchListener {
  return {
    instance,
    listener,
    currentTarget,
  };
}

//! 注册简单事件
SimpleEventPlugin.registerEvents();
