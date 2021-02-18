import FlowStates from "./FlowStates";
import State, { StartState } from "./State";
import Transition from "./Transition";

class StateMachine {
  private currentState: State;

  constructor(public flowStates: FlowStates, private dataStore: Object = {}) {
    this.currentState = new StartState();
  }

  getData(): Object {
    return this.dataStore;
  }

  setData(dataStore: Object = {}) {
    this.dataStore = dataStore;
  }

  getCurrentState(): State {
    return this.currentState;
  }

  getTransitions(): Transition[] {
    return this.currentState.transitions
      .map((target) => this.flowStates.input.transitions[target.name])
      .sort((a, b) => b.priority - a.priority);
  }

  step(): State {
    const transitions = this.getTransitions();
    for (let i = 0; i < transitions.length; i++) {
      if (transitions[i].validates(this.dataStore)) {
        this.currentState = this.flowStates.getState(transitions[i].toState);
        break;
      }
    }
    return this.currentState;
  }

  stepToState(stateName: string): boolean {
    const transitions = this.getTransitions();
    for (let i = 0; i < transitions.length; i++) {
      if (
        stateName === transitions[i].toState &&
        transitions[i].validates(this.dataStore)
      ) {
        this.currentState = this.flowStates.getState(transitions[i].toState);
        return true;
      }
    }
    return false;
  }
}
export default StateMachine;
