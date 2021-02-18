import { FlowFormat } from "./Flow";

export type ReferenceFormat = {
  transition: number;
  toState: number;
  fromStates: number[];
};

type ReferencesMap = ReferenceFormat[];
export default ReferencesMap;

export const createReferencesMap = (flow: FlowFormat): ReferencesMap => {
  const map: ReferencesMap = [];
  flow.states.forEach((state) => {
    state.targets.forEach((target) => {
      const reference = map.find((ref) => ref.transition === target.id);
      if (reference) {
        reference.fromStates.push(state.id);
      } else {
        map.push({
          transition: target.id,
          toState: target.toState,
          fromStates: [state.id]
        });
      }
    });
  });
  return map;
};
