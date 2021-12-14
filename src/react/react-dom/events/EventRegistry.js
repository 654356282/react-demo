// 存储react事件所对应的原生事件名
export const registrationNameDependencies = {}

// 存储已经注册的原生事件名
export const allNativeEvents = new Set()

export function registerDirectEvent(registrationName, dependencies) {
    registrationNameDependencies[registrationName] = dependencies
    for(let i = 0; i < dependencies.length; i++) {
        allNativeEvents.add(dependencies[i])
    }
}

export function registerTwoPhaseEvent(registrationName, dependencies) {
  registerDirectEvent(registrationName, dependencies);
  registerDirectEvent(registrationName + "Capture", dependencies);
  console.log(registrationNameDependencies, allNativeEvents)
}
