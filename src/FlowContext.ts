import React from "react";

import { FlowBuildFormat, ReferencesMap, Transition, State, StateCategory } from "./FlowStates";

export const defaultFlow: FlowBuildFormat = {
  name: "New FlowStates",
  startState: 'Start',
  states: [
    {
      id: "Start",
      category: StateCategory.IDLE,
      targets: [
        { id: "Get doing it", toState: "Doing" }
      ]
    },
    {
      id: "Doing",
      category: StateCategory.OPEN,
      targets: [
        { id: "Finish it", toState: "Finished" }
      ]
    },
    { id: "Finished", category: StateCategory.CLOSED, targets: [] }
  ],
  transitions: [
    {
      id: "Get doing it",
      toState: "Doing",
      onTransition: () => {
        console.log("Transition -- Get doing it");
      }
    },
    {
      id: "Finish it",
      toState: "Finished",
      onTransition: () => {
        console.log("Transition -- Finish it");
      }
    }
  ]
};

export type FlowContextProps = {
  flow: FlowBuildFormat,
  referencesMap: ReferencesMap,
  changeFlow: (flow: FlowBuildFormat) => void,
  changeState: (state: State, idx: number) => void,
  addState: () => void,
  removeState: (id: string) => void,
  changeTransition: (transition: Transition, idx: number) => void,
  addTransition: () => void,
  removeTransition: (id: string) => void,
};

const FlowContext = React.createContext<FlowContextProps>({
  flow: defaultFlow,
  referencesMap: [],
  changeFlow: (flow: FlowBuildFormat) => {},
  changeState: (state: State, idx: number) => {},
  addState: () => {},
  removeState: (id: string) => {},
  changeTransition: (transition: Transition, idx: number) => {},
  addTransition: () => {},
  removeTransition: (id: string) => {},
});
export default FlowContext;
