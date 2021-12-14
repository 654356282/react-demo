import { allNativeEvents } from "./EventRegistry";
import { IS_CAPTURE_PHASE } from "./EventSystemFlags";
import * as SimpleEventPlugin from "./plugins/SimpleEventPlugin";
import { createEventListenerWrapperWithPriority } from "./ReactDOMEventListener";

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

//! 注册简单事件
SimpleEventPlugin.registerSimpleEvents();
