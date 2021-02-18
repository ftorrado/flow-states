import React from "react";

import { Flow, FlowFormat, ReferencesMap, Transition } from "./FlowStates";
import State, { StateCategory } from "./FlowStates/State";

export const defaultFlow: FlowFormat = {
  name: "New FlowStates",
  states: [
    {
      id: 1,
      name: "Start",
      category: StateCategory.IDLE,
      targets: [
        { id:1, toState: 2 }
      ]
    },
    {
      id: 2,
      name: "Doing",
      category: StateCategory.OPEN,
      targets: [
        { id: 2, toState: 3 }
      ]
    },
    { id: 3, name: "Finished", category: StateCategory.CLOSED, targets: [] }
  ],
  transitions: [
    {
      id: 1,
      name: "Get doing it",
      toState: 2,
      onTransition: () => {
        console.log("Transition -- Get doing it");
      }
    },
    {
      id: 2,
      name: "Finish it",
      toState: 3,
      onTransition: () => {
        console.log("Transition -- Finish it");
      }
    }
  ]
};

export type FlowContextProps = {
  flow: Flow,
  referencesMap: ReferencesMap,
  changeFlow: (flow: Flow) => void,
  changeState: (state: State, idx: number) => void,
  addState: () => void,
  removeState: (id: number) => void,
  changeTransition: (transition: Transition, idx: number) => void,
  addTransition: () => void,
  removeTransition: (id: number) => void,
};

const FlowContext = React.createContext<FlowContextProps>({
  flow: defaultFlow,
  referencesMap: [],
  changeFlow: (flow: Flow) => {},
  changeState: (state: State, idx: number) => {},
  addState: () => {},
  removeState: (id: number) => {},
  changeTransition: (transition: Transition, idx: number) => {},
  addTransition: () => {},
  removeTransition: (id: number) => {},
});
export default FlowContext;
