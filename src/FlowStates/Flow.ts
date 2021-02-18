import State, { emptyState } from "./State";
import Transition, { emptyTransition } from "./Transition";

export type FlowFormat = {
  name: string;
  states: State[];
  transitions: Transition[];
  startState?: number;
};

export const emptyFlow = (): FlowFormat => ({
  name: "",
  states: [],
  transitions: []
});

class Flow {
  public name: string;
  public states: State[];
  public transitions: Transition[];
  public startState?: number;
  public stateIdCounter: number;
  public transitionIdCounter: number;

  constructor(
    { name, states, transitions, startState }: FlowFormat,
    stateIdCounter: number = 0,
    transitionIdCounter: number = 0
  ) {
    this.name = name;
    this.states = states;
    this.transitions = transitions;
    this.startState = startState;
    this.stateIdCounter = stateIdCounter;
    this.transitionIdCounter = transitionIdCounter;
  }

  getData(): FlowFormat {
    return {
      name: this.name,
      states: this.states,
      transitions: this.transitions,
      startState: this.startState
    };
  }

  getStateIdCounter(): number {
    return this.stateIdCounter;
  }

  getTransitionIdCounter(): number {
    return this.transitionIdCounter;
  }

  private getStateIndex(id: number) {
    return this.states.findIndex((state) => state.id === id);
  }

  private getTransitionIndex(id: number) {
    return this.transitions.findIndex((transition) => transition.id === id);
  }

  createState(): State {
    const state = emptyState(this.stateIdCounter++);
    this.states.push(state);
    return state;
  }

  stateHasTransition(stateId: number, transitionId: number): boolean {
    return (
      (
        this.states.find((state) => state.id === stateId)?.targets || []
      ).findIndex((target) => target.id === transitionId) > 0
    );
  }

  addTransitionToState(stateId: number, transitionId: number): boolean {
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
      toState: this.transitions[transitionIdx].toState || -1
    });
    return true;
  }

  removeTransitionFromState(stateId: number, transitionId: number): boolean {
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

  removeState(id: number): boolean {
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

  setStartState(stateId: number) {
    this.startState = stateId;
  }

  createTransition(): Transition {
    const transition = emptyTransition(this.transitionIdCounter++);
    this.transitions.push(transition);
    return transition;
  }

  changeTransitionTarget(transitionId: number, stateId: number): boolean {
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

  removeTransition(id: number): boolean {
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
export default Flow;
