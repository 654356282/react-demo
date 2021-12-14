export const NoLanes = 0b0000000000000000000000000000000
export const NoLane = 0b0000000000000000000000000000000
export const SyncLane = 0b0000000000000000000000000000001

export const TotalLanes = 31

export const NoTimestamp = -1;

export function createLaneMap(initial) {
    const laneMap = []
    for(let i = 0; i < TotalLanes; i++) {
        laneMap.push(initial)
    }
    return laneMap
}