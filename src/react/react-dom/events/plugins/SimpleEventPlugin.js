import {
  registerSimpleEvents,
  topLevelEventsToReactNames,
} from "../DOMEventProperties";
import { IS_CAPTURE_PHASE } from "../EventSystemFlags";
import { SyntheticPointerEvent, SyntheticEvent } from "../SyntheticEvent";
import { accumulateSinglePhaseListeners } from "../DOMPluginEventSystem";

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === undefined) return;
  let SyntheticEventCtor = SyntheticEvent;
  let reactEventType = domEventName;
  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticPointerEvent;
      break;
  }

  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;

  const accumulateTargetOnly = !inCapturePhase && domEventName === "scroll";

  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase,
    accumulateTargetOnly,
    nativeEvent
  );
  if (listeners.length > 0) {
    const event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({ event, listeners });
  }
}

export { registerSimpleEvents as registerEvents, extractEvents };
