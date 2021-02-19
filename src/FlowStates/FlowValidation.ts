import FlowError, {
  CyclicalError,
  DeadendStateError,
  NoStartStateError,
  StateMissingError,
  TransitionMissingError,
  UnreachableStateError,
  UnexpectedError
} from "./FlowError";
import Flow, { FlowFormat } from "./Flow";
import { StateCategory } from "./State";
import ReferencesMap, { createReferencesMap } from "./ReferencesMap";

class FlowValidation {
  private referencesMap: ReferencesMap;
  private errors: FlowError[];
  private flowHelper: Flow;

  constructor(private flow: FlowFormat, _referencesMap?: ReferencesMap) {
    this.referencesMap = _referencesMap || createReferencesMap(flow);
    this.flowHelper = new Flow(flow);
    this.errors = this.doValidation();
  }

  private doValidation(): FlowError[] {
    this.errors = [
      ...this.validationStartState(),
      ...this.validationStates(),
      ...this.validationTransitions()
    ];
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): FlowError[] {
    return this.errors;
  }

  private validationStartState(): FlowError[] {
    if (!this.flow.startState) {
      return [new NoStartStateError()];
    }
    // check if start state is valid
    try {
      this.flowHelper.getStartState();
      return [];
    } catch (error) {
      return [new StateMissingError(this.flow.startState)];
    }
  }

  private validationStates(): FlowError[] {
    const errors: FlowError[] = [];
    // states with no stateTransitions should only be of CLOSED category
    // check for unreachable states
    // check for missing transitions
    this.flow.states.forEach((state) => {
      if (
        state.targets.length === 0 &&
        state.category !== StateCategory.CLOSED
      ) {
        errors.push(new DeadendStateError(state.id));
      }
      if (
        state.id !== this.flow.startState &&
        !this.referencesMap.find((ref) => ref.toState === state.id)
      ) {
        errors.push(new UnreachableStateError(state.id));
      }
      state.targets.forEach((target) => {
        try {
          this.flowHelper.getTransition(target.id);
        } catch (error) {
          errors.push(new TransitionMissingError(target.id, state.id));
        }
      });
    });
    return errors;
  }

  private validationTransitions(): FlowError[] {
    const errors: FlowError[] = [];
    // check for missing source or target states
    // check for cycles
    this.flow.transitions.forEach((transition) => {
      try {
        this.flowHelper.getState(transition.toState);
      } catch (error) {
        errors.push(new StateMissingError(transition.toState));
      }
      const reference = this.referencesMap.find(
        (ref) => ref.transition === transition.id
      );
      if (!reference) {
        throw new UnexpectedError("Transition missing in references");
      }
      if (reference.fromStates.some((from) => from === transition.toState)) {
        errors.push(new CyclicalError(transition.id));
      }
    });
    return errors;
  }
}
export default FlowValidation;
