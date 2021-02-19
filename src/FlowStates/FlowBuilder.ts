import State, { emptyState } from "./State";
import Transition, { emptyTransition } from "./Transition";

export type FlowBuildFormat = {
  name: string;
  states: State[];
  transitions: Transition[];
  startState?: string;
};

export const emptyFlow = (): FlowBuildFormat => ({
  name: "",
  states: [],
  transitions: []
});

/**
 * Class with helpers for building a flow
 */
class FlowBuilder {
  public name: string;
  public states: State[];
  public transitions: Transition[];
  public startState?: string;

  constructor(
    { name, states, transitions, startState }: FlowBuildFormat
  ) {
    this.name = name;
    this.states = states;
    this.transitions = transitions;
    this.startState = startState;
  }

  getData(): FlowBuildFormat {
    return {
      name: this.name,
      states: this.states,
      transitions: this.transitions,
      startState: this.startState
    };
  }

  private getStateIndex(id: string) {
    return this.states.findIndex((state) => state.id === id);
  }

  private getTransitionIndex(id: string) {
    return this.transitions.findIndex((transition) => transition.id === id);
  }

  createState(): State {
    const state = emptyState(`newState${this.states.length+1}`);
    this.states.push(state);
    return state;
  }

  stateHasTransition(stateId: string, transitionId: string): boolean {
    return (
      (
        this.states.find((state) => state.id === stateId)?.targets || []
      ).findIndex((target) => target.id === transitionId) > 0
    );
  }

  addTransitionToState(stateId: string, transitionId: string): boolean {
    const stateIdx = this.getStateIndex(stateId);
    const transitionIdx = this.getTransitionIndex(transitionId);
    if (
      stateIdx < 0 ||
      transitionIdx < 0 ||
      this.stateHasTransition(stateId, transitionId)
    ) {
      return false;
    }

    this.states[stateIdx].targets.push({
      id: transitionId,
      toState: this.transitions[transitionIdx].toState
    });
    return true;
  }

  removeTransitionFromState(stateId: string, transitionId: string): boolean {
    const stateIdx = this.getStateIndex(stateId);
    if (stateIdx < 0) {
      return false
    }
    const targets = this.states[stateIdx].targets.slice();
    const targetIdx = targets.findIndex((target) => target.id === transitionId);
    if (targetIdx < 0) {
      return false
    }
    this.states[stateIdx].targets = targets.filter((_, i) => i !== targetIdx);
    return true;
  }

  removeState(id: string): boolean {
    // remove state from array
    const idx = this.getStateIndex(id);
    if (idx < 0) {
      return false;
    }
    const states = this.states.slice().filter((_, i) => i !== idx);

    // remove from transitions and state "targets"
    this.transitions = this.transitions.filter(
      (transition) => transition.toState !== id
    );
    states.forEach((state) => {
      const targetIdx = state.targets.findIndex(
        (target) => target.toState === id
      );
      if (targetIdx > 0) {
        state.targets = state.targets.filter((_, i) => i !== targetIdx);
      }
    });
    // remove if is startState
    if (this.startState === id) {
      this.startState = undefined;
    }

    // save results
    this.states = states;
    return true;
  }

  setStartState(stateId: string) {
    this.startState = stateId;
  }

  createTransition(): Transition {
    const transition = emptyTransition(`newTransition${this.transitions.length+1}`);
    this.transitions.push(transition);
    return transition;
  }

  changeTransitionTarget(transitionId: string, stateId: string): boolean {
    const stateIdx = this.getStateIndex(stateId);
    const transitionIdx = this.getTransitionIndex(transitionId);
    if (stateIdx < 0 || transitionIdx < 0) {
      return false;
    }
    this.transitions[transitionIdx].toState = stateId;
    this.states.forEach((state) => {
      state.targets.forEach((target) => {
        if (target.id === transitionId) {
          target.toState = stateId;
        }
      });
    });
    return true;
  }

  removeTransition(id: string): boolean {
    // remove transition from array
    const idx = this.getTransitionIndex(id);
    if (idx < 0) {
      return false;
    }
    const transitions = this.transitions.slice().filter((_, i) => i !== idx);

    // remove from state "targets"
    this.states.forEach((state) => {
      const targetIdx = state.targets.findIndex(
        (target) => target.id === id
      );
      if (targetIdx > 0) {
        state = {
          ...state,
          targets: state.targets.filter((_, i) => i !== targetIdx)
        };
      }
    });

    // save results
    this.transitions = transitions;
    return true;
  }
}
export default FlowBuilder;
