class FlowError {
  constructor(
    public code: number,
    public name: string,
    public message: string
  ) {}
}
export default FlowError;

export class UnexpectedError extends FlowError {
  constructor(msg: string) {
    super(0x0000, "UnexpectedError", `Something went wrong: ${msg}`);
  }
}

export class StateMissingError extends FlowError {
  constructor(stateName: string) {
    super(0x0001, "StateMissingError", `State not found in flow ${stateName}`);
  }
}

export class TransitionMissingError extends FlowError {
  constructor(transitionName: string, stateName?: string) {
    super(
      0x0002,
      "TransitionMissingError",
      `Transition not found in flow ${transitionName}` +
        (stateName ? ` from state ${stateName}` : "")
    );
  }
}

export class CyclicalError extends FlowError {
  constructor(transitionName: string) {
    super(
      0x0003,
      "CyclicalError",
      `Found a cyclical transition ${transitionName}`
    );
  }
}

export class UnreachableStateError extends FlowError {
  constructor(stateName: string) {
    super(
      0x0004,
      "UnreachableStateError",
      `A state in the flow is not reachable: ${stateName}`
    );
  }
}

export class DeadendStateError extends FlowError {
  constructor(stateName: string) {
    super(
      0x0005,
      "DeadendStateError",
      `There is a deadend (no transitions or closed state) in the flow on state ${stateName}`
    );
  }
}

export class NoStartStateError extends FlowError {
  constructor() {
    super(0x0006, "NoStartStateError", "There is no start state");
  }
}

export class OverwriteStateWarning extends FlowError {
  constructor(stateName: string) {
    super(0x0101, "OverwriteStateWarning", `Overwriting state ${stateName}`);
  }
}

export class OverwriteTransitionWarning extends FlowError {
  constructor(transitionName: string) {
    super(
      0x0102,
      "OverwriteTransitionWarning",
      `Overwriting transition ${transitionName}`
    );
  }
}
