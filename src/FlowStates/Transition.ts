import State from "./State";

export type TransitionTarget = {
  id: string;
  toState: string;
};

type Transition = {
  id: string;
  toState: string;
  priority?: number;
  validate?: (dataStore: Object, sourceState: State) => boolean;
  onTransition?: (dataStore: Object, sourceState: State) => void;
};
export default Transition;

export const emptyTransition = (id: string): Transition => ({
  id,
  toState: '',
});
