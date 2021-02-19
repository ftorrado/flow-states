import Flow, { FlowFormat } from "./Flow";
import State from "./State";
import Transition from "./Transition";

/**
 * Simple state machine using this custom flow format
 */
class FlowStates {
  public flow: Flow;
  private currentState: State;

  constructor(public _flow: FlowFormat, public dataStore: Object = {}) {
    this.flow = new Flow(_flow);
    this.currentState = this.flow.getStartState();
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
    return this.flow.transitions;
  }

  getNextTransitions(): Transition[] {
    return this.currentState.targets
      .map((target) => this.flow.getTransition(target.id))
      .sort((a, b) => b.priority - a.priority);
  }

  validateTransition(transition: Transition) {
    if (transition.validate instanceof Function) {
      return (transition.validate as Function)(this.dataStore, this.currentState);
    }
    return true;
  }

  dispatch(action?: string): State {
    const transitions = this.getNextTransitions();
    for (let i = 0; i < transitions.length; i++) {
      if (this.validateTransition(transitions[i])) {
        this.currentState = this.flow.getState(transitions[i].toState);
        break;
      }
    }
    return this.currentState;
  }

  stepToState(stateName: string): boolean {
    const transitions = this.getTransitions();
    for (let i = 0; i < transitions.length; i++) {
      if (stateName === transitions[i].toState && this.validateTransition(transitions[i])) {
        this.currentState = this.flow.getState(transitions[i].toState);
        return true;
      }
    }
    return false;
  }
}
export default FlowStates;
