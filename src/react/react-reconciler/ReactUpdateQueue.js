import { NoLanes } from "./ReactFiberLane";

export function initializeUpdateQueue(fiber) {
    const queue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null,
            lanes: NoLanes
        },
        effects: null
    }
    fiber.updateQueue = queue
}