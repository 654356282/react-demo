import {
  DiscreteEventPriority,
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
} from "@react/react-reconciler/ReactEventPriorities";
import { IS_CAPTURE_PHASE } from "./EventSystemFlags";
import { hasQueuedDiscreteEvents } from "./ReactDOMEventReplaying";

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
}

function dispatchDiscreteEvent(
  domName,
  eventSystemFlags,
  container,
  nativeEvent
) {
  const previousPriority = getCurrentUpdatePriority();
  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    //TODO: react离散事件，待完成
    dispatchEvent();
  } finally {
    setCurrentUpdatePriority(previousPriority);
  }
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
  }
}

export function getEventPriority(domEventName) {
  switch (domEventName) {
    case "click":
      return DiscreteEventPriority;
  }
}
