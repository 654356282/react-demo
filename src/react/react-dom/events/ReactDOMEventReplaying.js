const queuedDiscreteEvents = []

export function hasQueuedDiscreteEvents() {
    return queuedDiscreteEvents.length > 0
}