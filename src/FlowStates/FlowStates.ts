import FlowInput from "./FlowInput";
import State from "./State";
import Transition from "./Transition";

export type FlowStatesFormat = {
  name: string;
  states: Record<string, State>;
  transitions: Record<string, Transition>;
  startState: string;
};

class FlowStates {
  public flow: FlowStatesFormat;

  constructor(private input: FlowInput) {
    this.flow = this.toObject();
  }

  toObject(): FlowStatesFormat {
    const { name, states, transitions, startState } = this.input;
    if (typeof startState === "undefined") {
      throw new Error("Flow states needs to be valid");
    }
    return {
      name,
      states,
      transitions,
      startState
    };
  }

  getFlowName(): string {
    return this.flow.name;
  }

  getState(stateName: string): State {
    return this.flow.states[stateName];
  }

  getStartState(): State {
    return this.flow.states[this.flow.startState];
  }

  getTransition(transitionName: string): Transition {
    return this.flow.transitions[transitionName];
  }
}
export default FlowStates;
