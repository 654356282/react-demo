export default function getEventTarget(nativeEvent) {
  return nativeEvent.target || window;
}
