import FlowError, {
  CyclicalError,
  DeadendStateError,
  NoStartStateError,
  StateMissingError,
  TransitionMissingError,
  UnreachableStateError,
  UnexpectedError
} from "./FlowError";
import { FlowFormat } from "./Flow";
import { StateCategory } from "./State";
import ReferencesMap, { createReferencesMap } from "./ReferencesMap";

class FlowValidation {
  private referencesMap: ReferencesMap;
  private errors: FlowError[];

  constructor(private input: FlowFormat) {
    this.referencesMap = createReferencesMap(input);
    this.errors = this.doValidation();
  }

  doValidation(): FlowError[] {
    this.errors = [
      ...this.validationStartState(),
      ...this.validationStates(),
      ...this.validationTransitions()
    ];
    return this.errors;
  }

  validate(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): FlowError[] {
    return this.errors;
  }

  private validationStartState(): FlowError[] {
    if (!this.input.startState) {
      return [new NoStartStateError()];
    }
    // check if start state is valid
    const startState = this.input.states[this.input.startState];
    if (!startState) {
      return [new StateMissingError(this.input.startState)];
    }
    return [];
  }

  private validationStates(): FlowError[] {
    const errors: FlowError[] = [];
    // states with no stateTransitions should only be of CLOSED category
    // check for unreachable states
    // check for missing transitions
    Object.keys(this.input.states).forEach((stateName) => {
      const state = this.input.states[stateName];
      if (
        state.transitions.length === 0 &&
        state.category !== StateCategory.CLOSED
      ) {
        errors.push(new DeadendStateError(stateName));
      }
      if (
        state.name !== this.input.startState &&
        !this.referencesMap.find((ref) => ref.toState === state.name)
      ) {
        errors.push(new UnreachableStateError(stateName));
      }
      state.transitions.forEach((target) => {
        if (!this.input.transitions[target.name]) {
          errors.push(new TransitionMissingError(target.name, stateName));
        }
      });
    });
    return errors;
  }

  private validationTransitions(): FlowError[] {
    const errors: FlowError[] = [];
    // check for missing source or target states
    // check for cycles
    Object.keys(this.input.transitions).forEach((transitionName) => {
      const transition = this.input.transitions[transitionName];
      if (!this.input.states[transition.toState]) {
        errors.push(new StateMissingError(transition.toState));
      }
      const reference = this.referencesMap.find(
        (ref) => ref.transition === transition.name
      );
      if (!reference) {
        throw new UnexpectedError("Transition missing in references");
      }
      if (reference.fromStates.some((from) => from === transition.toState)) {
        errors.push(new CyclicalError(transitionName));
      }
    });
    return errors;
  }
}
export default FlowValidation;
