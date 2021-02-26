
export type TransitionTarget = {
  id: string;
  toState: string;
};

type Transition = {
  id: string;
  toState: string;
  priority?: number;
  validate?: (dataStore: Object, sourceState: string) => boolean;
  onTransition?: (dataStore: Object, sourceState: string) => void;
};
export default Transition;

export const emptyTransition = (id: string): Transition => ({
  id,
  toState: '',
});
