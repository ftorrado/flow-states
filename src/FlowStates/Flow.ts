import { StateMissingError, TransitionMissingError } from "./FlowError";
import State from "./State";
import Transition from "./Transition";

export type FlowFormat = {
  name: string;
  states: State[];
  transitions: Transition[];
  startState: string;
};

/**
 * Class with helpers for using a flow
 */
class Flow {
  public name: string;
  public states: State[];
  public transitions: Transition[];
  public startState: string;

  constructor(flow: FlowFormat) {
    this.name = flow.name;
    this.states = flow.states;
    this.transitions = flow.transitions;
    this.startState = flow.startState;
  }

  getData(): FlowFormat {
    return {
      name: this.name,
      states: this.states,
      transitions: this.transitions,
      startState: this.startState
    };
  }

  getStartState(): State {
    return this.getState(this.startState);
  }

  getState(id: string): State {
    const result = this.states.find((state) => state.id === id);
    if (!result) throw new StateMissingError(id);
    return result;
  }

  getTransition(id: string): Transition {
    const result = this.transitions.find((transition) => transition.id === id);
    if (!result) throw new TransitionMissingError(id);
    return result;
  }
}
export default Flow;
